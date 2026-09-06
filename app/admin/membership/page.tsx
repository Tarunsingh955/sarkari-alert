import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import MembershipPageClient from '@/components/ui/MembershipPageClient'

export default async function MembershipPage() {
  const admin = await getAdminUser(); if (!admin) redirect('/admin/login')
  const [{ data: memberships }, { count: active }, { count: expired }] = await Promise.all([
    supabaseAdmin.from('memberships').select('*,users(name,email)').order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabaseAdmin.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
  ])
  const totalRev = (memberships || []).reduce((s: number, m: any) => s + (m.amount || 0), 0)
  return <MembershipPageClient memberships={memberships || []} active={active || 0} expired={expired || 0} totalRev={totalRev} />
}
