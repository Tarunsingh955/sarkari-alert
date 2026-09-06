import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { dryRun } = await req.json().catch(() => ({ dryRun: true }))

    const { data: states } = await supabaseAdmin.from('states').select('id,name').neq('name', 'All India')
    const stateList = (states || []).sort((a, b) => b.name.length - a.name.length)

    const { data: jobs } = await supabaseAdmin.from('jobs').select('id,title,department').is('state_id', null)

    const updates: { id: string; state_id: string; matchedState: string }[] = []
    for (const job of jobs || []) {
      const haystack = `${job.department || ''} ${job.title || ''}`.toLowerCase()
      const match = stateList.find(s => haystack.includes(s.name.toLowerCase()))
      if (match) updates.push({ id: job.id, state_id: match.id, matchedState: match.name })
    }

    if (!dryRun) {
      for (const u of updates) {
        await supabaseAdmin.from('jobs').update({ state_id: u.state_id }).eq('id', u.id)
      }
    }

    return NextResponse.json({
      totalUnassigned: jobs?.length || 0,
      matched: updates.length,
      unmatched: (jobs?.length || 0) - updates.length,
      applied: !dryRun,
    })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
