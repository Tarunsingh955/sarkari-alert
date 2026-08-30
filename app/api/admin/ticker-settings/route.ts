import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'

async function ensureSettingsRow() {
  const { data } = await supabaseAdmin.from('ticker_settings').select('*').eq('id', 1).single()
  if (data) return data
  const { data: created } = await supabaseAdmin.from('ticker_settings').insert({ id: 1, job_limit: 5, pinned_job_ids: [], excluded_job_ids: [] }).select().single()
  return created
}

export async function GET() {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const settings = await ensureSettingsRow()
  const jobLimit = settings?.job_limit ?? 5
  const pinnedIds: string[] = settings?.pinned_job_ids || []
  const excludedIds: string[] = settings?.excluded_job_ids || []

  let pinnedJobs: any[] = []
  if (pinnedIds.length) {
    const { data } = await supabaseAdmin.from('jobs').select('id,title,total_posts,slug').in('id', pinnedIds)
    const byId = new Map((data || []).map((j: any) => [j.id, j]))
    pinnedJobs = pinnedIds.map(id => byId.get(id)).filter(Boolean)
  }

  const remaining = jobLimit - pinnedJobs.length
  let autoJobs: any[] = []
  if (remaining > 0) {
    const skipIds = [...pinnedIds, ...excludedIds]
    const { data } = await supabaseAdmin
      .from('jobs')
      .select('id,title,total_posts,slug')
      .eq('is_published', true)
      .not('id', 'in', `(${(skipIds.length ? skipIds : ['00000000-0000-0000-0000-000000000000']).join(',')})`)
      .order('created_at', { ascending: false })
      .limit(remaining)
    autoJobs = data || []
  }

  return NextResponse.json({ job_limit: jobLimit, pinned_jobs: pinnedJobs, auto_jobs: autoJobs, excluded_job_ids: excludedIds })
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { job_limit, pinned_job_ids, excluded_job_ids } = await req.json()
    await ensureSettingsRow()
    const update: any = { updated_at: new Date().toISOString() }
    if (typeof job_limit === 'number') update.job_limit = Math.max(0, Math.min(20, job_limit))
    if (Array.isArray(pinned_job_ids)) update.pinned_job_ids = pinned_job_ids
    if (Array.isArray(excluded_job_ids)) update.excluded_job_ids = excluded_job_ids
    const { error } = await supabaseAdmin.from('ticker_settings').update(update).eq('id', 1)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
