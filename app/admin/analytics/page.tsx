import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import AnalyticsPageClient from '@/components/ui/AnalyticsPageClient'

export default async function AnalyticsPage() {
  const admin = await getAdminUser(); if (!admin) redirect('/admin/login')
  const [
    { data: recentPayments }, { data: topJobs }, { data: recentUsers },
    { count: todayViews }, { count: monthViews }, { data: revenue }
  ] = await Promise.all([
    supabaseAdmin.from('payments').select('*').eq('status','success').order('created_at',{ascending:false}).limit(15),
    supabaseAdmin.from('jobs').select('title,slug,views,categories(name)').order('views',{ascending:false}).limit(10),
    supabaseAdmin.from('users').select('name,email,created_at,role,is_premium').order('created_at',{ascending:false}).limit(10),
    supabaseAdmin.from('page_views').select('*',{count:'exact',head:true}).gte('created_at',new Date(Date.now()-86400000).toISOString()),
    supabaseAdmin.from('page_views').select('*',{count:'exact',head:true}).gte('created_at',new Date(Date.now()-30*86400000).toISOString()),
    supabaseAdmin.from('payments').select('amount,type').eq('status','success'),
  ])
  const totalRev = (revenue||[]).reduce((s:number,p:any)=>s+(p.amount||0),0)
  const resumeRev = (revenue||[]).filter((p:any)=>p.type==='resume').reduce((s:number,p:any)=>s+(p.amount||0),0)
  const premRev = (revenue||[]).filter((p:any)=>p.type?.startsWith('premium')).reduce((s:number,p:any)=>s+(p.amount||0),0)
  return (
    <AnalyticsPageClient
      recentPayments={recentPayments || []}
      topJobs={topJobs || []}
      recentUsers={recentUsers || []}
      todayViews={todayViews || 0}
      monthViews={monthViews || 0}
      totalRev={totalRev}
      resumeRev={resumeRev}
      premRev={premRev}
      totalPayments={(revenue || []).length}
    />
  )
}
