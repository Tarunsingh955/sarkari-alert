import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')
  let query = supabaseAdmin.from('current_affairs').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(50)
  if (month) query = query.eq('month', month)
  const { data } = await query
  return NextResponse.json({ items: data || [] })
}