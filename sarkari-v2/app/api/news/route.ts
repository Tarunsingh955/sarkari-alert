import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 60, 60000); if (limited) return limited
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 20)
    const category = searchParams.get('category')
    let query = supabaseAdmin.from('news').select('*', { count: 'exact' }).eq('is_published', true).eq('is_active', true).order('created_at', { ascending: false })
    if (category) query = query.eq('category', category)
    query = query.range((page - 1) * limit, page * limit - 1)
    const { data, count } = await query
    return NextResponse.json({ news: data || [], total: count || 0 }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
