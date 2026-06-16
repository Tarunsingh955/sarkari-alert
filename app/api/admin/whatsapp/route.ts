import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, count } = await supabaseAdmin.from('whatsapp_subscribers').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  return NextResponse.json({ subscribers: data || [], total: count || 0 })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { message, phone } = await req.json()
  if (!message) return NextResponse.json({ error: 'Message zaroori hai' }, { status: 400 })
  const token = process.env.WHATSAPP_API_TOKEN; const phoneId = process.env.WHATSAPP_PHONE_ID
  if (!token || !phoneId) return NextResponse.json({ error: 'WhatsApp not configured' }, { status: 500 })
  let targets: string[] = []
  if (phone) { targets = [phone] }
  else {
    const { data: subs } = await supabaseAdmin.from('whatsapp_subscribers').select('phone').eq('is_active', true)
    targets = (subs || []).map((s: any) => s.phone)
  }
  let sent = 0
  for (const to of targets) {
    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: message } }) }).catch(() => null)
    if (res?.ok) sent++
    await new Promise(r => setTimeout(r, 100))
  }
  return NextResponse.json({ success: true, sent, total: targets.length })
}
