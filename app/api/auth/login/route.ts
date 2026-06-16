import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, generateToken, setSessionCookie, logAdminAction } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60000); if (limited) return limited
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email aur password zaroori hai' }, { status: 400 })
    const { data: user } = await supabaseAdmin.from('users').select('*').eq('email', email.toLowerCase()).single()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    if (!user) { await supabaseAdmin.from('login_logs').insert({ ip_address: ip, success: false }); return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }) }
    const valid = await verifyPassword(password, user.password)
    if (!valid) { await supabaseAdmin.from('login_logs').insert({ user_id: user.id, ip_address: ip, success: false }); return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }) }
    await supabaseAdmin.from('login_logs').insert({ user_id: user.id, ip_address: ip, success: true })
    if (['admin','super_admin','editor'].includes(user.role)) await logAdminAction(user.id, 'LOGIN', null, ip)
    const token = await generateToken(user.id, user.role)
    await setSessionCookie(token)
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, is_premium: user.is_premium } })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
