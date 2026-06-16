import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { createRazorpayOrder } from '@/lib/payments'
import { rateLimit } from '@/lib/rateLimit'

const PRICES: Record<string, number> = { resume: 10, premium_monthly: 49, premium_yearly: 199, sponsored_basic: 199, sponsored_standard: 499, sponsored_premium: 999 }

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 10, 60000); if (limited) return limited
  try {
    const user = await getSessionUser()
    const { type } = await req.json()
    const amount = PRICES[type]
    if (!amount) return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 })
    const order = await createRazorpayOrder(amount, type, user?.id)
    return NextResponse.json(order)
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
