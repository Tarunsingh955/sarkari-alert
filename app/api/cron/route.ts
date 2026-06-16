import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const secret = new URL(req.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await supabaseAdmin.rpc('disable_expired_jobs')
    return NextResponse.json({ success: true, message: 'Expired jobs disabled', timestamp: new Date() })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
