import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'
import { extractOfficialLink } from '@/lib/automation'

// Re-checks job links using source_url — the ORIGINAL aggregator article
// link, saved separately at insert time — rather than the current
// apply_link/official_website, which may already have been corrupted by an
// earlier bad extraction. Re-extracting from an already-bad link can never
// recover; you have to go back to the true original source every time.
export async function POST() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let fixed = 0
  let checked = 0

  const { data: jobRows } = await supabaseAdmin.from('jobs').select('id,source_url,apply_link,official_website')
  for (const row of jobRows || []) {
    if (!row.source_url) continue
    checked++
    const newLink = await extractOfficialLink(row.source_url)
    if (newLink && newLink !== row.apply_link) {
      await supabaseAdmin.from('jobs').update({ apply_link: newLink, official_website: newLink }).eq('id', row.id)
      fixed++
    }
  }

  return NextResponse.json({ success: true, checked, fixed })
}