import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser, hashPassword, verifyPassword, logAdminAction } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword) return NextResponse.json({ error: 'Current aur new password dono zaroori hain' }, { status: 400 })
    if (newPassword.length < 8) return NextResponse.json({ error: 'Naya password kam se kam 8 characters ka hona chahiye' }, { status: 400 })

    const { data: userRow } = await supabaseAdmin.from('users').select('password').eq('id', admin.id).single()
    if (!userRow) return NextResponse.json({ error: 'User nahi mila' }, { status: 404 })

    const isValid = await verifyPassword(currentPassword, userRow.password)
    if (!isValid) return NextResponse.json({ error: 'Current password galat hai' }, { status: 400 })

    const newHash = await hashPassword(newPassword)
    const { error } = await supabaseAdmin.from('users').update({ password: newHash, updated_at: new Date().toISOString() }).eq('id', admin.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await logAdminAction(admin.id, 'password_changed')

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
