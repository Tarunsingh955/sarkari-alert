import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 3, 60000); if (limited) return limited
  try {
    const body = await req.json()
    if (!body.company_name || !body.email) return NextResponse.json({ error: 'Company name aur email zaroori hai' }, { status: 400 })
    await supabaseAdmin.from('ad_requests').insert(body)
    return NextResponse.json({ success: true, message: 'Inquiry bhej di gayi!' })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
