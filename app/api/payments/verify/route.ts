import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { verifyRazorpayPayment, activatePremium } from '@/lib/payments'

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type } = await req.json()
    const payment = await verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    if (!payment) return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    const user = await getSessionUser()
    if (user && (type === 'premium_monthly' || type === 'premium_yearly')) {
      const plan = type === 'premium_monthly' ? 'monthly' : 'yearly'
      await activatePremium(user.id, plan, razorpay_payment_id)
    }
    return NextResponse.json({ success: true, payment })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
