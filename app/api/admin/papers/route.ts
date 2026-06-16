import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser, logAdminAction } from '@/lib/auth'
import { generateUniqueSlug } from '@/lib/seo'

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, count } = await supabaseAdmin.from('previous_papers').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  return NextResponse.json({ papers: data || [], total: count || 0 })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    if (!body.title || !body.category) return NextResponse.json({ error: 'Title aur category zaroori hai' }, { status: 400 })
    const slug = generateUniqueSlug(body.title)
    const { data, error } = await supabaseAdmin.from('previous_papers').insert({ ...body, slug }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    await logAdminAction(admin.id, 'CREATE_PAPER', { paper_id: data.id })
    return NextResponse.json({ success: true, paper: data }, { status: 201 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await supabaseAdmin.from('previous_papers').delete().eq('id', id)
  await logAdminAction(admin.id, 'DELETE_PAPER', { paper_id: id })
  return NextResponse.json({ success: true })
}
