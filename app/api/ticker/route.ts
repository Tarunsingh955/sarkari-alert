import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const [{ data: messages }, { data: settings }] = await Promise.all([
    supabaseAdmin.from('ticker_messages').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    supabaseAdmin.from('ticker_settings').select('*').eq('id', 1).single(),
  ])

  const jobLimit = settings?.job_limit ?? 5
  const pinnedIds: string[] = settings?.pinned_job_ids || []
  const excludedIds: string[] = settings?.excluded_job_ids || []

  let jobs: any[] = []
  if (jobLimit > 0) {
    let pinnedJobs: any[] = []
    if (pinnedIds.length) {
      const { data } = await supabaseAdmin.from('jobs').select('id,title,total_posts').in('id', pinnedIds).eq('is_published', true)
      const byId = new Map((data || []).map((j: any) => [j.id, j]))
      pinnedJobs = pinnedIds.map(id => byId.get(id)).filter(Boolean)
    }
    const remaining = jobLimit - pinnedJobs.length
    let fillerJobs: any[] = []
    if (remaining > 0) {
      const skipIds = [...pinnedIds, ...excludedIds]
      const { data } = await supabaseAdmin
        .from('jobs')
        .select('id,title,total_posts')
        .eq('is_published', true)
        .not('id', 'in', `(${(skipIds.length ? skipIds : ['00000000-0000-0000-0000-000000000000']).join(',')})`)
        .order('created_at', { ascending: false })
        .limit(remaining)
      fillerJobs = data || []
    }
    jobs = [...pinnedJobs, ...fillerJobs].slice(0, jobLimit)
  }

  return NextResponse.json({ messages: messages || [], jobs }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
  })
}
