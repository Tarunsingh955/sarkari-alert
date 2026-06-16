import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabase'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export const hashPassword = (p: string) => bcrypt.hash(p, 12)
export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h)

export async function generateToken(userId: string, role: string) {
  return new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { userId: string; role: string }
  } catch { return null }
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('sa_token')?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  const { data } = await supabaseAdmin.from('users').select('id,email,name,role,is_premium,is_verified').eq('id', payload.userId).single()
  return data
}

export async function getAdminUser() {
  const user = await getSessionUser()
  if (!user || !['super_admin','admin','editor'].includes(user.role)) return null
  return user
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('sa_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('sa_token')
}

export function generateToken6() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function logAdminAction(adminId: string, action: string, details?: any, ip?: string) {
  await supabaseAdmin.from('admin_logs').insert({ admin_id: adminId, action, details, ip_address: ip })
}
