import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data } = await supabaseAdmin.from('memberships').select('*').eq('user_id', user.id).eq('status', 'active').order('created_at', { ascending: false }).limit(1)
  return NextResponse.json({ membership: data?.[0] || null })
}
