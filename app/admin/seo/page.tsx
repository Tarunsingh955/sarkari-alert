'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function AdminSEOPage() {
  const { colors } = useTheme()
  const [settings, setSettings] = useState({
    site_name: '', site_description: '', site_keywords: '',
    google_verification: '', adsense_id: '', ga_id: '', razorpay_key: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const showMsg = (text: string, type = 'success') => {
    setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000)
  }

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    setLoading(true)
    const res = await fetch('/api/admin/seo')
    const data = await res.json()
    if (data.settings) setSettings(s => ({ ...s, ...data.settings }))
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const res = await fetch('/api/admin/seo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    const data = await res.json()
    if (data.success) showMsg('SEO settings save ho gayi!')
    else showMsg('Error: ' + data.error, 'error')
    setSaving(false)
  }

  const iS = { width: '100%', padding: '10px 14px', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 10 }
  const lS = { display: 'block' as const, fontSize: 10, color: colors.textMuted, fontWeight: 600 as const, marginBottom: 4, textTransform: 'uppercase' as const }

  if (loading) return <div style={{ padding: 24, color: colors.textMuted }}>Loading...</div>

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: colors.textPrimary, margin: 0 }}>SEO Settings</h1>
        <p style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Site ka SEO aur integrations configure karo</p>
      </div>
      {msg.text && <div style={{ background: msg.type === 'error' ? '#ef444420' : '#10b98120', border: `1px solid ${msg.type === 'error' ? '#ef444440' : '#10b98140'}`, borderRadius: 8, padding: '10px 16px', color: msg.type === 'error' ? '#ef4444' : '#34d399', fontSize: 13, marginBottom: 16 }}>{msg.text}</div>}
      <form onSubmit={handleSave}>
        <div style={{ background: colors.cardBg, borderRadius: 14, padding: 20, border: `1px solid ${colors.cardBorder}`, marginBottom: 16 }}>
          <h3 style={{ color: colors.accent, fontSize: 14, marginBottom: 16 }}>🔍 Basic SEO</h3>
          <label style={lS}>Site Name</label>
          <input value={settings.site_name} onChange={e => setSettings(s => ({ ...s, site_name: e.target.value }))} placeholder="SarkariAlert" style={iS} />
          <label style={lS}>Site Description</label>
          <textarea value={settings.site_description} onChange={e => setSettings(s => ({ ...s, site_description: e.target.value }))} placeholder="India ki #1 Sarkari Naukri website..." style={{ ...iS, height: 80, resize: 'vertical' as const }} />
          <label style={lS}>Keywords</label>
          <input value={settings.site_keywords} onChange={e => setSettings(s => ({ ...s, site_keywords: e.target.value }))} placeholder="sarkari job, government job..." style={iS} />
        </div>
        <div style={{ background: colors.cardBg, borderRadius: 14, padding: 20, border: `1px solid ${colors.cardBorder}`, marginBottom: 16 }}>
          <h3 style={{ color: colors.accent, fontSize: 14, marginBottom: 16 }}>📊 Analytics & Verification</h3>
          <label style={lS}>Google Analytics ID</label>
          <input value={settings.ga_id} onChange={e => setSettings(s => ({ ...s, ga_id: e.target.value }))} placeholder="G-XXXXXXXXXX" style={iS} />
          <label style={lS}>Google Site Verification</label>
          <input value={settings.google_verification} onChange={e => setSettings(s => ({ ...s, google_verification: e.target.value }))} placeholder="google-site-verification=XXXXX" style={iS} />
        </div>
        <div style={{ background: colors.cardBg, borderRadius: 14, padding: 20, border: `1px solid ${colors.cardBorder}`, marginBottom: 16 }}>
          <h3 style={{ color: colors.accent, fontSize: 14, marginBottom: 16 }}>💰 Monetization</h3>
          <label style={lS}>Google AdSense ID</label>
          <input value={settings.adsense_id} onChange={e => setSettings(s => ({ ...s, adsense_id: e.target.value }))} placeholder="ca-pub-XXXXXXXXXX" style={iS} />
          <label style={lS}>Razorpay Key ID</label>
          <input value={settings.razorpay_key} onChange={e => setSettings(s => ({ ...s, razorpay_key: e.target.value }))} placeholder="rzp_live_XXXXXXXXXX" style={iS} />
        </div>
        <button type="submit" disabled={saving} style={{ background: saving ? colors.cardBorder: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 8, padding: '12px 32px', color: saving ? colors.textMuted : '#000', fontWeight: 800, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving...' : '💾 Save SEO Settings'}
        </button>
      </form>
    </div>
  )
}