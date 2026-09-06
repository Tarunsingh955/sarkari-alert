'use client'
import { useState } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function ChangePasswordPage() {
  const { colors } = useTheme()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMsg({ text: 'Naya password aur confirm password match nahi kar rahe', type: 'error' })
      return
    }
    setLoading(true)
    setMsg({ text: '', type: '' })
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ text: 'Password successfully change ho gaya!', type: 'success' })
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      } else {
        setMsg({ text: data.error || 'Kuch galat ho gaya', type: 'error' })
      }
    } catch {
      setMsg({ text: 'Server error, dobara try karein', type: 'error' })
    }
    setLoading(false)
  }

  const iS = { width: '100%', padding: '12px 14px', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 14 }
  const lS = { display: 'block' as const, fontSize: 11, color: colors.textMuted, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }

  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: colors.textPrimary, marginBottom: 6 }}>Change Password</h1>
      <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 20 }}>Apna admin account password yahan se badlein</p>

      {msg.text && (
        <div style={{ background: msg.type === 'error' ? '#ef444420' : '#10b98120', border: `1px solid ${msg.type === 'error' ? '#ef444440' : '#10b98140'}`, borderRadius: 8, padding: '10px 16px', color: msg.type === 'error' ? '#ef4444' : '#34d399', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: colors.cardBg, borderRadius: 14, padding: 24, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
        <label style={lS}>Current Password</label>
        <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={iS} />

        <label style={lS}>New Password</label>
        <input type="password" required minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} style={iS} />

        <label style={lS}>Confirm New Password</label>
        <input type="password" required minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={iS} />

        <p style={{ color: colors.textMuted, fontSize: 11, marginBottom: 18 }}>Password kam se kam 8 characters ka hona chahiye</p>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 0', background: loading ? colors.cardBorder : `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 8, color: loading ? colors.textMuted : '#000', fontWeight: 800, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
