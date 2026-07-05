import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin.from('seo_settings').select('*')
  const settings: Record<string, string> = {}
  for (const row of data || []) settings[row.key] = row.value || ''
  return NextResponse.json({ settings })
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    for (const [key, value] of Object.entries(body)) {
      await supabaseAdmin.from('seo_settings').update({ value: String(value), updated_at: new Date().toISOString() }).eq('key', key)
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}