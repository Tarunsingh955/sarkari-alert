import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'
import { extractOfficialLink } from '@/lib/automation'

const OFFICIAL_SUFFIXES = ['.gov.in', '.nic.in', '.co.in', '.org.in', '.ac.in', '.res.in', '.edu.in', '.ind.in']

function alreadyLooksOfficial(url: string | null): boolean {
  if (!url) return true // nothing to fix
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return OFFICIAL_SUFFIXES.some(suffix => host.endsWith(suffix))
  } catch { return true }
}

// Processes a bounded BATCH per call (Vercel serverless functions time out
// on long-running requests), and skips rows that already look official
// without even fetching them — call this repeatedly (e.g. from the browser
// console, a few times in a row) until "remaining" comes back as 0.
export async function POST(req: NextRequest) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get('limit') || 20)

  const { data: jobRows } = await supabaseAdmin.from('jobs').select('id,source_url,apply_link,official_website')
  const needsFix = (jobRows || []).filter(r => r.source_url && !alreadyLooksOfficial(r.apply_link))

  const batch = needsFix.slice(0, limit)
  let fixed = 0
  for (const row of batch) {
    const newLink = await extractOfficialLink(row.source_url)
    if (newLink && newLink !== row.apply_link) {
      await supabaseAdmin.from('jobs').update({ apply_link: newLink, official_website: newLink }).eq('id', row.id)
      fixed++
    }
  }

  return NextResponse.json({
    success: true,
    processedThisBatch: batch.length,
    fixed,
    remaining: needsFix.length - batch.length,
  })
}