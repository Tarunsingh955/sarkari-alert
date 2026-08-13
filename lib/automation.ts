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

// For third-party aggregator feeds, the RSS link points to their own article,
// not the official government page. This fetches that article and pulls out
// the first outbound link to a recognizable official domain (.gov.in, .nic.in,
// etc.), excluding both the article's own domain and the known aggregator
// domain, so we don't just return a self-referential link.
// Domains that are never the "official recruiting organisation" — social
// media, trackers, fonts/CDN assets, the aggregator sites themselves, and
// common WordPress theme boilerplate (footer credits, XFN profile links,
// etc). This list can never be fully complete, which is why we prefer
// searching within the RSS article's own content body (see below) rather
// than the full raw page — that avoids header/footer chrome entirely.
const NEVER_OFFICIAL = [
  'facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com',
  'youtube.com', 'whatsapp.com', 't.me', 'telegram.org', 'pinterest.com', 'reddit.com',
  'google.com', 'googleapis.com', 'gstatic.com', 'googletagmanager.com', 'google-analytics.com',
  'doubleclick.net', 'fonts.googleapis.com', 'w3.org', 'schema.org',
  'wordpress.com', 'wordpress.org', 'wp.com', 'gravatar.com', 'jsdelivr.net', 'cloudflare.com',
  'sarkarinaukrijobalert.com', 'sahisarkarijobs.in',
  'gmpg.org', 's.w.org', 'api.w.org', 'wp.me', 'tantek.com', 'automattic.com',
]

function findOfficialLinkIn(html: string, articleHost: string): string | null {
  // Real clickable <a href="..."> links AND bare URLs written as plain text
  // (some sites type "Apply at: https://krcl.co.in" without making it a
  // clickable link) — both count as candidates.
  const hrefUrls = [...html.matchAll(/<a\s[^>]*href="(https?:\/\/[^"]+)"/gi)].map(m => m[1])
  const bareUrls = [...html.matchAll(/(https?:\/\/[a-z0-9.-]+\.[a-z]{2,}(?:\.[a-z]{2})?[^\s"'<>)]*)/gi)].map(m => m[1])
  const allCandidates = [...hrefUrls, ...bareUrls]

  const validCandidates = allCandidates.filter(href => {
    let candidateHost = ''
    try { candidateHost = new URL(href).hostname.replace(/^www\./, '') } catch { return false }
    if (candidateHost === articleHost) return false
    if (NEVER_OFFICIAL.some(blocked => candidateHost === blocked || candidateHost.endsWith('.' + blocked))) return false
    return true
  })

  // Tier 1 (high confidence): almost every genuine Indian government/PSU/
  // board site ends in one of these suffixes — prefer these first.
  const indianOfficialSuffixes = ['.gov.in', '.nic.in', '.co.in', '.org.in', '.ac.in', '.res.in', '.edu.in', '.ind.in']
  const tier1 = validCandidates.find(href => {
    const host = new URL(href).hostname.replace(/^www\./, '')
    return indianOfficialSuffixes.some(suffix => host.endsWith(suffix))
  })
  if (tier1) return tier1

  // Tier 2 (lower confidence fallback): some legitimate official orgs use
  // plain .org/.com/.aero domains (e.g. madcindia.org, aai.aero) instead of
  // an India-specific TLD. Since it already passed the blocklist above,
  // take the first remaining external link as a best-effort guess rather
  // than giving up and pointing back at the aggregator article.
  return validCandidates[0] || null
}

// Prefer searching the RSS item's own article-body content first (no theme
// header/footer noise at all — just the actual writeup), and only fall back
// to fetching+scraping the live page if the feed content has nothing usable.
export async function extractOfficialLink(articleUrl: string, articleContent?: string): Promise<string> {
  if (!articleUrl) return articleUrl
  let articleHost = ''
  try { articleHost = new URL(articleUrl).hostname.replace(/^www\./, '') } catch { return articleUrl }

  if (articleContent) {
    const fromContent = findOfficialLinkIn(articleContent, articleHost)
    if (fromContent) return fromContent
  }

  try {
    const res = await fetch(articleUrl, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return articleUrl
    const html = await res.text()
    return findOfficialLinkIn(html, articleHost) || articleUrl
  } catch {
    return articleUrl
  }
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
    const officialLink = await extractOfficialLink(d.link || d.official_website || '', d.content)

    const { data: job } = await supabaseAdmin.from('jobs').insert({
      title: jobTitle,
      slug,
      department: jobDept,
      category_id: categoryRow?.id || null,
      total_posts: 'As per notification',
      last_date: d.last_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      salary_text: 'As per rules',
      description: d.content || '',
      apply_link: officialLink,
      official_website: officialLink,
      source_url: item.source_url,
      is_published: true,
      is_active: true,
      created_by: adminId,
    }).select().single()
    if (job) {
      await Promise.allSettled([sendTelegramAlert(job), sendEmailAlerts(job), sendWhatsAppAlert(job), sendPushNotification(job.title, `${job.total_posts} Posts available!`, `/jobs/${job.slug}`)])
    }
  } else if (item.type === 'admit_card') {
    const officialLink = await extractOfficialLink(d.link || '', d.content)
    await supabaseAdmin.from('admit_cards').insert({
      title: d.title || item.title,
      slug,
      release_date: new Date().toISOString().split('T')[0],
      download_link: officialLink,
      details: d.content || '',
      is_active: true,
    })
  } else if (item.type === 'result') {
    const officialLink = await extractOfficialLink(d.link || '', d.content)
    await supabaseAdmin.from('results').insert({
      title: d.title || item.title,
      slug,
      release_date: new Date().toISOString().split('T')[0],
      download_link: officialLink,
      details: d.content || '',
      is_active: true,
    })
  } else if (item.type === 'answer_key') {
    const officialLink = await extractOfficialLink(d.link || '', d.content)
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