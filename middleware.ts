import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // Security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  res.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;")

  // Admin route protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('sa_token')?.value
    if (!token) return NextResponse.redirect(new URL('/admin/login', req.url))
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET) as any
      if (!['super_admin','admin','editor'].includes(payload.role)) return NextResponse.redirect(new URL('/admin/login', req.url))
    } catch { return NextResponse.redirect(new URL('/admin/login', req.url)) }
  }

  // Admin API protection
  if (pathname.startsWith('/api/admin')) {
    const token = req.cookies.get('sa_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET) as any
      if (!['super_admin','admin','editor'].includes(payload.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    } catch { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }) }
  }

  // Dashboard protection
  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('sa_token')?.value
    if (!token) return NextResponse.redirect(new URL('/login?redirect=' + pathname, req.url))
    try { await jwtVerify(token, JWT_SECRET) } catch { return NextResponse.redirect(new URL('/login', req.url)) }
  }

  return res
}

export const config = { matcher: ['/api/admin/:path*', '/dashboard/:path*'] }
