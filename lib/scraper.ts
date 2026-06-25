import { supabaseAdmin } from './supabase'
import { generateUniqueSlug } from './seo'
import crypto from 'crypto'

function makeHash(text: string): string {
  return crypto.createHash('sha256').update(text.toLowerCase().trim()).digest('hex')
}

async function isDuplicate(title: string, org: string): Promise<boolean> {
  const hash = makeHash(title + org)
  const { data } = await supabaseAdmin.from('content_hashes').select('id').eq('content_hash', hash).single()
  return !!data
}

async function saveHash(title: string, org: string) {
  const hash = makeHash(title + org)
  await supabaseAdmin.from('content_hashes').upsert(
    { content_hash: hash, source_url: 'employmentnews.gov.in', content_type: 'job' },
    { onConflict: 'content_hash' }
  )
}

function parseDDMMYYYY(d: string): string {
  const m = d.trim().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (m) {
    const [, dd, mm, yyyy] = m
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
  }
  return new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
}

interface JobRow {
  issuedDate: string
  organisation: string
  post: string
  method: string
  lastDate: string
  detailLink: string | null
}

export async function scrapeEmploymentNews(): Promise<JobRow[]> {
  const res = await fetch('https://employmentnews.gov.in/newemp/AllJobs.aspx?k=All', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SarkariAlertBot/1.0; +https://sarkari-alert.com)' }
  })
  const html = await res.text()
  const rows: JobRow[] = []

  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  let rowMatch
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1]
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi
    const cells: string[] = []
    let cellMatch
    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      const cellText = cellMatch[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
      cells.push(cellText)
    }
    if (cells.length >= 5) {
      const [issuedDate, organisation, post, method, lastDate] = cells
      if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(issuedDate) && organisation && post) {
        const linkMatch = rowHtml.match(/href="([^"]+)"/)
        const detailLink = linkMatch ? linkMatch[1] : null
        rows.push({ issuedDate, organisation, post, method, lastDate, detailLink })
      }
    }
  }
  return rows
}

export async function runEmploymentNewsScrape(sourceId: string): Promise<{ fetched: number; newItems: number; duplicates: number; errors: number }> {
  let fetched = 0, newItems = 0, duplicates = 0, errors = 0

  try {
    const rows = await scrapeEmploymentNews()
    fetched = rows.length

    for (const row of rows) {
      try {
        const title = `${row.organisation} - ${row.post}`
        const dup = await isDuplicate(title, row.organisation)
        if (dup) { duplicates++; continue }

        const slug = generateUniqueSlug(title)
        const lastDateISO = parseDDMMYYYY(row.lastDate)

        // Skip if last date has already passed
        const lastDateObj = new Date(lastDateISO)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (lastDateObj < today) { continue }

        let detailUrl = ''
        if (row.detailLink) {
          detailUrl = row.detailLink.startsWith('http')
            ? row.detailLink
            : `https://employmentnews.gov.in/newemp/${row.detailLink.replace(/^\.?\//, '')}`
        }

        await supabaseAdmin.from('automation_queue').insert({
          title,
          data: {
            title,
            department: row.organisation,
            post_name: row.post,
            method_of_appointment: row.method,
            content: `${row.organisation} ne ${row.post} post ke liye ${row.method.toLowerCase()} ki notification jaari ki hai. Yeh notification Employment News (Government of India ki official jobs publication) mein prakashit hui hai. Apply karne se pehle official notification dhyan se padhein aur eligibility criteria check karein.`,
            last_date: lastDateISO,
            issued_date: parseDDMMYYYY(row.issuedDate),
            official_website: detailUrl || 'https://employmentnews.gov.in/newemp/AllJobs.aspx?k=All',
            source_name: 'Employment News (Govt of India)',
          },
          source_url: detailUrl || 'https://employmentnews.gov.in/newemp/AllJobs.aspx?k=All',
          type: 'job',
          status: 'pending'
        })

        await saveHash(title, row.organisation)
        newItems++
      } catch (e) {
        errors++
        console.error('Row processing error:', e)
      }
    }

    await supabaseAdmin.from('sources').update({ last_checked: new Date().toISOString() }).eq('id', sourceId)
  } catch (e) {
    console.error('Employment News scrape failed:', e)
    errors++
  }

  return { fetched, newItems, duplicates, errors }
}