import { supabaseAdmin } from './supabase'
import { generateUniqueSlug } from './seo'
import { sendTelegramAlert, sendEmailAlerts, sendWhatsAppAlert, sendPushNotification } from './notifications'

export async function runAutomation() {
  console.log('🤖 Automation started:', new Date().toISOString())
  const { data: sources } = await supabaseAdmin.from('sources').select('*').eq('is_active', true)
  if (!sources?.length) return { fetched: 0 }

  let totalFetched = 0
  for (const source of sources) {
    try {
      let fetched = 0
      if (source.type === 'rss') fetched = await scrapeRSS(source)
      totalFetched += fetched
      await supabaseAdmin.from('sources').update({ last_checked: new Date().toISOString() }).eq('id', source.id)
    } catch (err) { console.error(`Error: ${source.name}`, err) }
  }

  // Auto disable expired jobs & news
  await supabaseAdmin.rpc('disable_expired_jobs')

  console.log(`✅ Done. Fetched: ${totalFetched}`)
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
    await supabaseAdmin.from('automation_queue').insert({
      title: item.title || '',
      slug,
      data: {
        title: item.title,
        content: item.content || item.contentSnippet || '',
        link: item.link,
        pub_date: item.pubDate,
        source_name: source.name,
        category: source.category,
      },
      source_url: item.link || '',
      type: source.category === 'news' ? 'news' : 'job',
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
      department: d.source_name || 'Government of India',
      total_posts: 'As per notification',
      last_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      salary_text: 'As per rules',
      description: d.content || '',
      apply_link: d.link || '',
      source_url: item.source_url,
      is_published: true,
      is_active: true,
      created_by: adminId,
    }).select().single()
    if (job) {
      await Promise.allSettled([sendTelegramAlert(job), sendEmailAlerts(job), sendWhatsAppAlert(job), sendPushNotification(job.title, `${job.total_posts} Posts available!`, `/jobs/${job.slug}`)])
    }
  } else {
    const expiresAt = new Date(); expiresAt.setDate(expiresAt.getDate() + 30)
    await supabaseAdmin.from('news').insert({
      title: d.title || item.title,
      slug,
      content: d.content || '',
      external_link: d.link || '',
      category: d.category || 'General',
      is_published: true,
      expires_at: expiresAt.toISOString(),
      created_by: adminId,
    })
  }

  await supabaseAdmin.from('automation_queue').update({ status: 'approved', reviewed_by: adminId, reviewed_at: new Date().toISOString() }).eq('id', queueId)
}
