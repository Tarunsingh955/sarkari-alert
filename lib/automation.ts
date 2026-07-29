import { supabaseAdmin } from './supabase'
import { generateUniqueSlug } from './seo'
import { sendTelegramAlert, sendEmailAlerts, sendWhatsAppAlert, sendPushNotification } from './notifications'
import { runEmploymentNewsScrape } from './scraper'
import { classifyJobCategory, classifyItemType } from './classify'

export async function runAutomation() {
  console.log('Automation started:', new Date().toISOString())
  const { data: sources } = await supabaseAdmin.from('sources').select('*').eq('is_active', true)
  if (!sources?.length) return { fetched: 0 }
  let totalFetched = 0
  for (const source of sources) {
    try {
      let fetched = 0
      if (source.type === 'rss') {
        fetched = await scrapeRSS(source)
      } else if (source.type === 'scrape') {
        const result = await runEmploymentNewsScrape(source.id)
        fetched = result.newItems
      }
      totalFetched += fetched
      await supabaseAdmin.from('sources').update({ last_checked: new Date().toISOString() }).eq('id', source.id)
    } catch (err) { console.error(`Error: ${source.name}`, err) }
  }
  await supabaseAdmin.rpc('disable_expired_jobs')
  console.log(`Done. Fetched: ${totalFetched}`)
  return { fetched: totalFetched }
}

async function scrapeRSS(source: any): Promise<number> {
  const RSSParser = (await import('rss-parser')).default
  const parser = new RSSParser({ timeout: 10000 })
  const feed = await parser.parseURL(source.url)
  let count = 0

  const fixedType: 'news' | 'current_affairs' | null =
    source.category === 'news' ? 'news' :
    source.category === 'current_affairs' ? 'current_affairs' : null

  for (const item of (feed.items || []).slice(0, 15)) {
    const title = item.title || ''
    // If the source is explicitly tagged as news/current_affairs, keep that.
    // Otherwise (a mixed job-alert feed), detect admit_card/result/answer_key/job from the title.
    const itemType: 'job' | 'news' | 'current_affairs' | 'admit_card' | 'result' | 'answer_key' =
      fixedType || classifyItemType(title)

    const { data: existing } = await supabaseAdmin.from('automation_queue').select('id').eq('source_url', item.link || '').eq('type', itemType).maybeSingle()
    if (existing) continue
    const rawContent = item.content || item.contentSnippet || ''

    await supabaseAdmin.from('automation_queue').insert({
      title,
      data: {
        title,
        content: rawContent,
        question: `${title}?`,
        answer: rawContent.slice(0, 500),
        link: item.link,
        pub_date: item.pubDate,
        source_name: source.name,
        category: source.category,
      },
      source_url: item.link || '',
      type: itemType,
      status: 'pending'
    })
    count++
  }
  return count
}

async function generateMCQFromNews(title: string, content: string): Promise<{
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: string
  explanation: string
  topic: string
} | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY missing — skipping MCQ generation')
    return null
  }

  const prompt = `You are creating a competitive-exam style Current Affairs MCQ for an Indian government job aspirants website, based on this news item.

Title: ${title}
Content: ${content.slice(0, 1500)}

Create ONE multiple choice question testing a specific fact from this news (a name, number, place, date, or scheme — not a vague general question).

Respond with ONLY valid JSON, no markdown fences, no extra text, in this exact shape:
{
  "question": "...",
  "option_a": "...",
  "option_b": "...",
  "option_c": "...",
  "option_d": "...",
  "correct_option": "A",
  "explanation": "1-2 line explanation of why this is correct",
  "topic": "one or two word topic like Economy, Sports, Science, Defence, Awards, Appointments, etc."
}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      console.error('Claude API error:', res.status, await res.text())
      return null
    }

    const data = await res.json()
    const rawText = (data.content || [])
      .map((block: any) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim()

    const cleaned = rawText.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    if (!parsed.question || !parsed.option_a || !parsed.option_b || !parsed.correct_option) {
      console.error('Claude returned incomplete MCQ:', parsed)
      return null
    }

    return parsed
  } catch (err) {
    console.error('generateMCQFromNews failed:', err)
    return null
  }
}

// For third-party aggregator feeds, the RSS link points to their own article,
// not the official government page. This fetches that article and pulls out
// the first outbound link to a recognizable official domain (.gov.in, .nic.in,
// or a known state/board portal), falling back to the article link if none found.
export async function extractOfficialLink(articleUrl: string): Promise<string> {
  if (!articleUrl) return articleUrl
  try {
    const res = await fetch(articleUrl, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return articleUrl
    const html = await res.text()

    // Collect candidate URLs from BOTH real <a href> links AND bare URLs
    // that appear as plain text in the article body (some sites just type
    // out "link: https://..." instead of making it clickable).
    const hrefUrls = [...html.matchAll(/href="(https?:\/\/[^"]+)"/gi)].map(m => m[1])
    const bareUrls = [...html.matchAll(/(https?:\/\/[a-z0-9.-]+\.(?:gov\.in|nic\.in|ac\.in|org\.in)[^\s"'<>]*)/gi)].map(m => m[1])
    const allCandidates = [...hrefUrls, ...bareUrls]

    const officialPatterns = [/\.gov\.in/i, /\.nic\.in/i, /\.ac\.in/i, /\.org\.in/i, /rrb[a-z]*\.(com|gov\.in)/i, /ibps\.in/i, /sbi\.co\.in/i]
    const officialLink = allCandidates.find(href =>
      officialPatterns.some(p => p.test(href)) &&
      !href.includes('sarkarinaukrijobalert.com')
    )
    return officialLink || articleUrl
  } catch {
    return articleUrl
  }
}

export async function approveQueueItem(queueId: string, adminId: string) {
  const { data: item } = await supabaseAdmin.from('automation_queue').select('*').eq('id', queueId).single()
  if (!item) throw new Error('Item not found')
  const d = item.data
  const slug = generateUniqueSlug(d.title || item.title || 'untitled')

  if (item.type === 'job') {
    const jobTitle = d.title || item.title
    const jobDept = d.department || d.source_name || 'Government of India'
    const categorySlug = classifyJobCategory(jobTitle, jobDept)
    const { data: categoryRow } = await supabaseAdmin.from('categories').select('id').eq('slug', categorySlug).maybeSingle()

    const { data: job } = await supabaseAdmin.from('jobs').insert({
      title: jobTitle,
      slug,
      department: jobDept,
      category_id: categoryRow?.id || null,
      total_posts: 'As per notification',
      last_date: d.last_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      salary_text: 'As per rules',
      description: d.content || '',
      apply_link: d.link || d.official_website || '',
      official_website: d.official_website || d.link || '',
      source_url: item.source_url,
      is_published: true,
      is_active: true,
      created_by: adminId,
    }).select().single()
    if (job) {
      await Promise.allSettled([sendTelegramAlert(job), sendEmailAlerts(job), sendWhatsAppAlert(job), sendPushNotification(job.title, `${job.total_posts} Posts available!`, `/jobs/${job.slug}`)])
    }
  } else if (item.type === 'admit_card') {
    const officialLink = await extractOfficialLink(d.link || '')
    await supabaseAdmin.from('admit_cards').insert({
      title: d.title || item.title,
      slug,
      release_date: new Date().toISOString().split('T')[0],
      download_link: officialLink,
      details: d.content || '',
      is_active: true,
    })
  } else if (item.type === 'result') {
    const officialLink = await extractOfficialLink(d.link || '')
    await supabaseAdmin.from('results').insert({
      title: d.title || item.title,
      slug,
      release_date: new Date().toISOString().split('T')[0],
      download_link: officialLink,
      details: d.content || '',
      is_active: true,
    })
  } else if (item.type === 'answer_key') {
    const officialLink = await extractOfficialLink(d.link || '')
    await supabaseAdmin.from('answer_keys').insert({
      title: d.title || item.title,
      slug,
      release_date: new Date().toISOString().split('T')[0],
      download_link: officialLink,
      is_active: true,
    })
  } else if (item.type === 'current_affairs') {
    const now = new Date()
    const mcq = await generateMCQFromNews(d.title || item.title, d.content || d.answer || '')

    if (mcq) {
      await supabaseAdmin.from('current_affairs').insert({
        question: mcq.question,
        option_a: mcq.option_a,
        option_b: mcq.option_b,
        option_c: mcq.option_c,
        option_d: mcq.option_d,
        correct_option: mcq.correct_option,
        answer: mcq[`option_${mcq.correct_option.toLowerCase()}` as 'option_a'] || mcq.option_a,
        explanation: mcq.explanation,
        topic: mcq.topic || d.category || 'General',
        month: now.toLocaleString('en-US', { month: 'long' }),
        year: now.getFullYear(),
        is_active: true,
      })
    } else {
      await supabaseAdmin.from('current_affairs').insert({
        question: d.question || d.title || item.title,
        answer: d.answer || d.content || '',
        topic: d.category || 'General',
        month: now.toLocaleString('en-US', { month: 'long' }),
        year: now.getFullYear(),
        is_active: true,
      })
    }
  } else {
    // 'news' falls back here
    const expiresAt = new Date(); expiresAt.setDate(expiresAt.getDate() + 30)
    await supabaseAdmin.from('news').insert({
      title: d.title || item.title,
      slug,
      content: d.content || '',
      excerpt: (d.content || '').slice(0, 150),
      external_link: d.link || '',
      category: d.category || 'General',
      is_published: true,
      is_active: true,
      expires_at: expiresAt.toISOString(),
      created_by: adminId,
    })
  }
  await supabaseAdmin.from('automation_queue').update({ status: 'approved', reviewed_by: adminId, reviewed_at: new Date().toISOString() }).eq('id', queueId)
}