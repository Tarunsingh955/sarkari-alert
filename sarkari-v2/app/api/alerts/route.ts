import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60000); if (limited) return limited
  try {
    const { email, categories, states } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email zaroori hai' }, { status: 400 })
    const { data: existing } = await supabaseAdmin.from('alerts').select('id').eq('email', email).single()
    if (existing) await supabaseAdmin.from('alerts').update({ categories: categories || [], states: states || [], is_active: true }).eq('email', email)
    else await supabaseAdmin.from('alerts').insert({ email, categories: categories || [], states: states || [] })
    return NextResponse.json({ success: true, message: 'Job alerts subscribe ho gaye!' })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
