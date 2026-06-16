import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword, generateToken, setSessionCookie } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 3, 60000); if (limited) return limited
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password || password.length < 8) return NextResponse.json({ error: 'Invalid input — password min 8 chars' }, { status: 400 })
    const { data: existing } = await supabaseAdmin.from('users').select('id').eq('email', email.toLowerCase()).single()
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    const hashed = await hashPassword(password)
    const { data: user, error } = await supabaseAdmin.from('users').insert({ name, email: email.toLowerCase(), password: hashed, role: 'user' }).select('id,email,name,role,is_premium').single()
    if (error) return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
    const token = await generateToken(user.id, user.role)
    await setSessionCookie(token)
    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
