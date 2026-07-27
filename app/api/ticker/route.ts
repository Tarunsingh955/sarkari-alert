import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabaseAdmin.from('ticker_messages').select('*').eq('is_active', true).order('created_at', { ascending: false })
  return NextResponse.json({ messages: data || [] }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
  })
}