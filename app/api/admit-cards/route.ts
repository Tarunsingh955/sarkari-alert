import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 60, 60000); if (limited) return limited
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    let query = supabaseAdmin.from('admit_cards').select('*', { count: 'exact' }).eq('is_active', true).order('release_date', { ascending: false })
    if (search) query = query.ilike('title', `%${search}%`)
    const { data, count } = await query
    return NextResponse.json({ admitCards: data || [], total: count || 0 }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}