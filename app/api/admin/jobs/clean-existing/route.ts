import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'
import { cleanScrapedContent, extractOrgFromTitle } from '@/lib/automation'

// One-time clean-up for jobs that were published BEFORE the automation fixes:
//  1) description still contains raw HTML tags / entities
//  2) department holds the scraper source's own name (e.g. "Sarkari Naukri
//     Job Alert") instead of the real recruiting organisation
// dryRun=true only counts; dryRun=false actually updates.
export async function POST(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { dryRun } = await req.json().catch(() => ({ dryRun: true }))

    const { data: sources } = await supabaseAdmin.from('sources').select('name')
    const sourceNames = new Set((sources || []).map((s: any) => (s.name || '').trim().toLowerCase()).filter(Boolean))

    const { data: jobs } = await supabaseAdmin.from('jobs').select('id,title,department,description').limit(5000)

    const updates: { id: string; patch: { department?: string; description?: string } }[] = []
    for (const job of jobs || []) {
      const patch: { department?: string; description?: string } = {}

      const deptIsSource = sourceNames.has((job.department || '').trim().toLowerCase())
      if (deptIsSource) {
        const org = extractOrgFromTitle(job.title)
        if (org) patch.department = org
      }

      const desc = job.description || ''
      if (/<[a-z!\/][^>]*>|&(nbsp|amp|quot|#\d+|hellip|lt|gt);/i.test(desc)) {
        const cleaned = cleanScrapedContent(desc)
        if (cleaned !== desc) patch.description = cleaned
      }

      if (patch.department || patch.description) updates.push({ id: job.id, patch })
    }

    if (!dryRun) {
      for (const u of updates) await supabaseAdmin.from('jobs').update(u.patch).eq('id', u.id)
    }

    return NextResponse.json({
      totalJobs: jobs?.length || 0,
      needFix: updates.length,
      departmentFixes: updates.filter(u => u.patch.department).length,
      descriptionFixes: updates.filter(u => u.patch.description).length,
      applied: !dryRun,
    })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
