import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') || 1); const limit = 25
  const { data, count } = await supabaseAdmin.from('users').select('id,email,name,role,is_premium,is_verified,created_at', { count: 'exact' }).order('created_at', { ascending: false }).range((page-1)*limit, page*limit-1)
  return NextResponse.json({ users: data || [], total: count || 0 })
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin || admin.role !== 'super_admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, role, is_premium } = await req.json()
    const { data, error } = await supabaseAdmin.from('users').update({ role, is_premium }).eq('id', id).select('id,email,name,role,is_premium').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, user: data })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
