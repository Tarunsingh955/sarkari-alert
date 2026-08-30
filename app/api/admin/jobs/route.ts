import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser, logAdminAction } from '@/lib/auth'
import { generateUniqueSlug } from '@/lib/seo'
import { sendTelegramAlert, sendEmailAlerts, sendWhatsAppAlert } from '@/lib/notifications'

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') || 1); const limit = 25
  const search = searchParams.get('search')
  let query = supabaseAdmin.from('jobs').select('*,categories(name,color),states(name)', { count: 'exact' }).order('created_at', { ascending: false })
  if (search) query = query.ilike('title', `%${search}%`)
  const { data, count } = await query.range((page-1)*limit, page*limit-1)
  return NextResponse.json({ jobs: data || [], total: count || 0 })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    if (!body.title || !body.last_date) return NextResponse.json({ error: 'Title aur last_date zaroori hai' }, { status: 400 })
    const slug = generateUniqueSlug(body.title)
    const { data: job, error } = await supabaseAdmin.from('jobs').insert({ ...body, slug, created_by: admin.id }).select('*,categories(name,color,icon),states(name)').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    await logAdminAction(admin.id, 'CREATE_JOB', { job_id: job.id, title: job.title })
    if (job.is_published) await Promise.allSettled([sendTelegramAlert(job), sendEmailAlerts(job), sendWhatsAppAlert(job)])
    return NextResponse.json({ success: true, job }, { status: 201 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, ...body } = await req.json()
    const { data, error } = await supabaseAdmin.from('jobs').update(body).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    await logAdminAction(admin.id, 'UPDATE_JOB', { job_id: id })
    return NextResponse.json({ success: true, job: data })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await req.json()
    await supabaseAdmin.from('jobs').delete().eq('id', id)
    await logAdminAction(admin.id, 'DELETE_JOB', { job_id: id })
    return NextResponse.json({ success: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
