import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'
import { extractOfficialLink } from '@/lib/automation'

// One-time cleanup: re-extracts the official government link for any
// jobs / admit_cards / results / answer_keys rows whose link still points
// back to a source site (the third-party aggregator, or the article's own
// domain like employmentnews.gov.in) instead of the real official source.
const SELF_LINK_PATTERNS = ['sarkarinaukrijobalert', 'employmentnews.gov.in']

function matchesAny(url: string | null) {
  if (!url) return false
  return SELF_LINK_PATTERNS.some(p => url.includes(p))
}

export async function POST() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let fixed = 0
  let checked = 0

  for (const table of ['admit_cards', 'results', 'answer_keys']) {
    const { data: rows } = await supabaseAdmin.from(table).select('id,download_link')
    for (const row of rows || []) {
      if (!matchesAny(row.download_link)) continue
      checked++
      const newLink = await extractOfficialLink(row.download_link)
      if (newLink && newLink !== row.download_link) {
        await supabaseAdmin.from(table).update({ download_link: newLink }).eq('id', row.id)
        fixed++
      }
    }
  }

  const { data: jobRows } = await supabaseAdmin.from('jobs').select('id,apply_link,official_website')
  for (const row of jobRows || []) {
    const source = row.apply_link || row.official_website
    if (!matchesAny(source)) continue
    checked++
    const newLink = await extractOfficialLink(source)
    if (newLink && newLink !== source) {
      await supabaseAdmin.from('jobs').update({ apply_link: newLink, official_website: newLink }).eq('id', row.id)
      fixed++
    }
  }

  return NextResponse.json({ success: true, checked, fixed })
}