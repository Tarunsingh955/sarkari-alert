import { supabaseAdmin } from './supabase'
import crypto from 'crypto'

export async function createRazorpayOrder(amount: number, type: string, userId?: string) {
  const Razorpay = (await import('razorpay')).default
  const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! })
  const order = await instance.orders.create({ amount: amount * 100, currency: 'INR', receipt: `rcpt_${Date.now()}` })
  await supabaseAdmin.from('payments').insert({ user_id: userId, razorpay_order_id: order.id, amount, type, status: 'pending' })
  return { orderId: order.id, amount, currency: 'INR', keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID }
}

export async function verifyRazorpayPayment(orderId: string, paymentId: string, signature: string) {
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(`${orderId}|${paymentId}`).digest('hex')
  if (expected !== signature) throw new Error('Invalid signature')
  await supabaseAdmin.from('payments').update({ razorpay_payment_id: paymentId, razorpay_signature: signature, status: 'success' }).eq('razorpay_order_id', orderId)
  const { data: payment } = await supabaseAdmin.from('payments').select('*').eq('razorpay_order_id', orderId).single()
  return payment
}

export async function activatePremium(userId: string, plan: 'monthly' | 'yearly', paymentId: string) {
  const prices = { monthly: 49, yearly: 199 }
  const durations = { monthly: 30, yearly: 365 }
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + durations[plan])
  await supabaseAdmin.from('memberships').insert({ user_id: userId, plan_name: plan, amount: prices[plan], razorpay_payment_id: paymentId, end_date: endDate.toISOString(), status: 'active' })
  await supabaseAdmin.from('users').update({ is_premium: true }).eq('id', userId)
}
