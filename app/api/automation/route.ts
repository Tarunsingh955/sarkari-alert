import { NextRequest, NextResponse } from 'next/server'
import { runAutomation } from '@/lib/automation'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') || new URL(req.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const result = await runAutomation()
    return NextResponse.json({ success: true, ...result, timestamp: new Date() })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
