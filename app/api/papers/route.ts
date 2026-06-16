import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 60, 60000); if (limited) return limited
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const year = searchParams.get('year')
    const search = searchParams.get('search')
    let query = supabaseAdmin.from('previous_papers').select('*', { count: 'exact' }).eq('is_active', true).order('year', { ascending: false })
    if (category) query = query.eq('category', category)
    if (year) query = query.eq('year', Number(year))
    if (search) query = query.ilike('title', `%${search}%`)
    const { data, count } = await query
    return NextResponse.json({ papers: data || [], total: count || 0 })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
