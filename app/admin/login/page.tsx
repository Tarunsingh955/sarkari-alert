'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function AdminLoginPage() {
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const data = await res.json()
      if (data.success) router.push('/admin')
      else setError(data.error || 'Login failed')
    } catch { setError('Server error') }
    setLoading(false)
  }

  const iS = { width: '100%', padding: '12px 16px', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }
  const lS = { display: 'block' as const, fontSize: 11, color: colors.textMuted, fontWeight: 600 as const, marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: colors.cardBg, borderRadius: 20, padding: 40, width: '100%', maxWidth: 400, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: colors.accent, marginBottom: 4 }}>SarkariAlert</div>
          <div style={{ fontSize: 48, margin: '12px 0' }}>🔐</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: colors.textPrimary, marginBottom: 4 }}>Admin Login</h1>
          <p style={{ color: colors.textMuted, fontSize: 13 }}>Sirf authorized admins ke liye</p>
        </div>
        {error && <div style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 8, padding: '12px 16px', color: '#ef4444', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={lS}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@sarkari-alert.in" style={iS} /></div>
          <div><label style={lS}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={iS} /></div>
          <button type="submit" disabled={loading} style={{ padding: 14, background: loading ? colors.cardBorder : `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 10, color: loading ? colors.textMuted : '#000', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: 16, color: colors.textMuted, fontSize: 13, textDecoration: 'none' }}>← Back to Website</a>
      </div>
    </div>
  )
}
