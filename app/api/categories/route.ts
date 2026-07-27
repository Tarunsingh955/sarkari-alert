import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabaseAdmin.from('categories').select('id,name,slug').order('name', { ascending: true })
  return NextResponse.json({ categories: data || [] })
}