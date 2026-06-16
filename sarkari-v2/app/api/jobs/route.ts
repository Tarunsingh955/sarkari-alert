import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'
import { generateUniqueSlug } from '@/lib/seo'
import { sendTelegramAlert, sendEmailAlerts, sendWhatsAppAlert, sendPushNotification } from '@/lib/notifications'
import { rateLimit } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 60, 60000); if (limited) return limited
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const state = searchParams.get('state')
    const search = searchParams.get('search')
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 20)
    const sort = searchParams.get('sort') || 'newest'

    let query = supabaseAdmin.from('jobs').select('*,categories(name,color,icon),states(name)', { count: 'exact' }).eq('is_published', true).eq('is_active', true)
    if (category) query = query.eq('categories.slug', category)
    if (state) query = query.ilike('states.name', `%${state}%`)
    if (search) query = query.or(`title.ilike.%${search}%,department.ilike.%${search}%`)
    if (sort === 'deadline') query = query.order('last_date', { ascending: true })
    else if (sort === 'popular') query = query.order('views', { ascending: false })
    else query = query.order('created_at', { ascending: false })
    query = query.range((page - 1) * limit, page * limit - 1)

    const { data, count } = await query
    return NextResponse.json({ jobs: data || [], total: count || 0, page, pages: Math.ceil((count || 0) / limit) }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    if (!body.title || !body.last_date) return NextResponse.json({ error: 'Title aur last date zaroori hai' }, { status: 400 })
    const slug = generateUniqueSlug(body.title)
    const { data: job, error } = await supabaseAdmin.from('jobs').insert({ ...body, slug, created_by: admin.id }).select('*,categories(name,color,icon),states(name)').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (job?.is_published) {
      await Promise.allSettled([sendTelegramAlert(job), sendEmailAlerts(job), sendWhatsAppAlert(job), sendPushNotification(job.title, `${job.total_posts} Posts available!`, `/jobs/${job.slug}`)])
    }
    return NextResponse.json({ success: true, job }, { status: 201 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
