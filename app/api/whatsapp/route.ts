import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60000); if (limited) return limited
  try {
    const { phone, name, categories, states } = await req.json()
    if (!phone) return NextResponse.json({ error: 'Phone number zaroori hai' }, { status: 400 })
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '91')
    const { data: existing } = await supabaseAdmin.from('whatsapp_subscribers').select('id').eq('phone', cleanPhone).single()
    if (existing) await supabaseAdmin.from('whatsapp_subscribers').update({ name, categories: categories || [], states: states || [], is_active: true }).eq('phone', cleanPhone)
    else await supabaseAdmin.from('whatsapp_subscribers').insert({ phone: cleanPhone, name, categories: categories || [], states: states || [] })
    return NextResponse.json({ success: true, message: 'WhatsApp alerts subscribe ho gaye!' })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  try {
    const { phone } = await req.json()
    await supabaseAdmin.from('whatsapp_subscribers').update({ is_active: false }).eq('phone', phone)
    return NextResponse.json({ success: true, message: 'Unsubscribed successfully' })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
