import { NextRequest, NextResponse } from 'next/server'

const store = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(req: NextRequest, maxRequests = 10, windowMs = 60000) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown'
  const key = `${ip}:${req.nextUrl.pathname}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  if (entry.count >= maxRequests) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) }
    })
  }

  entry.count++
  return null
}
