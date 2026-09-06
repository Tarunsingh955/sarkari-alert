import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/ui/DashboardClient'

export default async function AdminDashboard() {
  const admin = await getAdminUser()
  if (!admin) redirect('/admin/login')

  const [
    { count: jobs }, { count: news }, { count: users }, { count: premium },
    { count: whatsapp }, { count: queue }, { data: revenue }, { data: topJobs }
  ] = await Promise.all([
    supabaseAdmin.from('jobs').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabaseAdmin.from('news').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabaseAdmin.from('whatsapp_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabaseAdmin.from('automation_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('payments').select('amount').eq('status', 'success'),
    supabaseAdmin.from('jobs').select('title,slug,views,categories(name)').order('views', { ascending: false }).limit(8),
  ])

  const totalRevenue = (revenue || []).reduce((s: number, p: any) => s + (p.amount || 0), 0)

  return (
    <DashboardClient
      adminName={admin.name}
      stats={{ jobs, news, users, premium, whatsapp, queue }}
      totalRevenue={totalRevenue}
      topJobs={topJobs || []}
    />
  )
}
