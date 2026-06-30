import { supabaseAdmin } from './supabase'
import { generateUniqueSlug } from './seo'
import { sendTelegramAlert, sendEmailAlerts, sendWhatsAppAlert, sendPushNotification } from './notifications'
import { runEmploymentNewsScrape } from './scraper'

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
  for (const item of (feed.items || []).slice(0, 15)) {
    const { data: existing } = await supabaseAdmin.from('automation_queue').select('id').eq('source_url', item.link || '').single()
    if (existing) continue
    const slug = generateUniqueSlug(item.title || 'untitled')

    let itemType: 'job' | 'news' | 'current_affairs' = 'job'
    if (source.category === 'news') itemType = 'news'
    if (source.category === 'current_affairs') itemType = 'current_affairs'

    const rawContent = item.content || item.contentSnippet || ''

    await supabaseAdmin.from('automation_queue').insert({
      title: item.title || '',
      data: {
        title: item.title,
        content: rawContent,
        question: `${item.title}?`,
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

export async function approveQueueItem(queueId: string, adminId: string) {
  const { data: item } = await supabaseAdmin.from('automation_queue').select('*').eq('id', queueId).single()
  if (!item) throw new Error('Item not found')
  const d = item.data
  const slug = generateUniqueSlug(d.title || item.title || 'untitled')

  if (item.type === 'job') {
    const { data: job } = await supabaseAdmin.from('jobs').insert({
      title: d.title || item.title,
      slug,
      department: d.department || d.source_name || 'Government of India',
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
  } else if (item.type === 'current_affairs') {
    const now = new Date()
    await supabaseAdmin.from('current_affairs').insert({
      question: d.question || d.title || item.title,
      answer: d.answer || d.content || '',
      topic: d.category || 'General',
      month: now.toLocaleString('en-US', { month: 'long' }),
      year: now.getFullYear(),
      is_active: true,
    })
  } else {
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