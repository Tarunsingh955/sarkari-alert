import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'
import { approveQueueItem } from '@/lib/automation'

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'pending'
  const { data } = await supabaseAdmin.from('automation_queue').select('*').eq('status', status).order('created_at', { ascending: false }).limit(50)
  return NextResponse.json({ items: data || [] })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { action, id } = await req.json()
  if (action === 'approve') { await approveQueueItem(id, admin.id); return NextResponse.json({ success: true, message: 'Approved & Published!' }) }
  if (action === 'reject') { await supabaseAdmin.from('automation_queue').update({ status: 'rejected', reviewed_by: admin.id, reviewed_at: new Date().toISOString() }).eq('id', id); return NextResponse.json({ success: true }) }
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
