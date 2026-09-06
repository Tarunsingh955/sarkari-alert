import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabaseAdmin.from('states').select('id,name,slug').eq('is_active', true).order('name', { ascending: true })
  return NextResponse.json({ states: data || [] }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
  })
}
