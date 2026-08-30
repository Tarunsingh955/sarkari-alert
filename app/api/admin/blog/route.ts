import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'
import { generateUniqueSlug } from '@/lib/seo'

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, count } = await supabaseAdmin.from('blog_posts').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  return NextResponse.json({ posts: data || [], total: count || 0 })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    if (!body.title || !body.content) return NextResponse.json({ error: 'Title aur content zaroori hain' }, { status: 400 })
    const slug = generateUniqueSlug(body.title)
    const { error } = await supabaseAdmin.from('blog_posts').insert({
      slug,
      title: body.title,
      excerpt: body.excerpt || null,
      content: body.content,
      category: body.category || 'General',
      is_published: body.is_published !== false,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, slug })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, title, excerpt, content, category, is_published } = await req.json()
    const update: any = { updated_at: new Date().toISOString() }
    if (typeof title === 'string') update.title = title
    if (typeof excerpt === 'string') update.excerpt = excerpt
    if (typeof content === 'string') update.content = content
    if (typeof category === 'string') update.category = category
    if (typeof is_published === 'boolean') update.is_published = is_published
    const { error } = await supabaseAdmin.from('blog_posts').update(update).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await req.json()
    const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
