import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'
import { extractOfficialLink } from '@/lib/automation'

// One-time cleanup: re-extracts the official government link for any
// admit_cards / results rows whose download_link still points back to the
// third-party aggregator site (sarkarinaukrijobalert.com) instead of the
// real official source.
export async function POST() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let fixed = 0

  for (const table of ['admit_cards', 'results', 'answer_keys']) {
    const { data: rows } = await supabaseAdmin.from(table).select('id,download_link').ilike('download_link', '%sarkarinaukrijobalert%')
    for (const row of rows || []) {
      const newLink = await extractOfficialLink(row.download_link)
      if (newLink && newLink !== row.download_link) {
        await supabaseAdmin.from(table).update({ download_link: newLink }).eq('id', row.id)
        fixed++
      }
    }
  }

  return NextResponse.json({ success: true, fixed })
}