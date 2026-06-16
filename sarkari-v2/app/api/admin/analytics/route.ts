import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'

export async function GET() {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [
    { count: totalJobs }, { count: totalNews }, { count: totalUsers },
    { count: totalPremium }, { count: totalWhatsApp }, { count: totalAlerts },
    { data: revenue }, { data: topJobs }, { data: recentPayments }, { count: todayViews }, { count: monthViews }
  ] = await Promise.all([
    supabaseAdmin.from('jobs').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabaseAdmin.from('news').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabaseAdmin.from('whatsapp_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabaseAdmin.from('alerts').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabaseAdmin.from('payments').select('amount').eq('status', 'success'),
    supabaseAdmin.from('jobs').select('title,slug,views,categories(name)').order('views', { ascending: false }).limit(10),
    supabaseAdmin.from('payments').select('*,users(name,email)').eq('status', 'success').order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 86400000).toISOString()),
    supabaseAdmin.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString()),
  ])
  const totalRevenue = (revenue || []).reduce((s: number, p: any) => s + (p.amount || 0), 0)
  return NextResponse.json({ totalJobs, totalNews, totalUsers, totalPremium, totalWhatsApp, totalAlerts, totalRevenue, todayViews, monthViews, topJobs, recentPayments })
}
