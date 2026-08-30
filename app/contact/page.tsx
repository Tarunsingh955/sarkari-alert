'use client'
import { useState } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function ContactPage() {
  const { colors } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { setStatus('sent'); setForm({ name: '', email: '', subject: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const iS: React.CSSProperties = { width: '100%', padding: '12px 14px', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }
  const lS: React.CSSProperties = { display: 'block', fontSize: 12, color: colors.textMuted, fontWeight: 600, marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <Header />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: colors.textPrimary, marginBottom: 8 }}>Contact Us</h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>Koi sawaal, feedback, ya kisi job listing mein galti dikhi? Neeche form bharke humein bataiye — hum jaldi se jaldi jawab dene ki koshish karenge.</p>

        {status === 'sent' ? (
          <div style={{ background: '#10b98120', border: '1px solid #10b98140', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
            <p style={{ color: '#34d399', fontWeight: 700, fontSize: 15 }}>Message bhej diya gaya!</p>
            <p style={{ color: colors.textMuted, fontSize: 13, marginTop: 6 }}>Hum jald hi aapse contact karenge.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: colors.cardBg, borderRadius: 14, padding: 24, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
            <label style={lS}>Naam *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={iS} />
            <label style={lS}>Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={iS} />
            <label style={lS}>Subject</label>
            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={iS} />
            <label style={lS}>Message *</label>
            <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ ...iS, height: 120, resize: 'vertical' }} />
            {status === 'error' && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>Kuch galat ho gaya, dobara try karein.</p>}
            <button type="submit" disabled={status === 'sending'} style={{ width: '100%', padding: '12px 0', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 8, color: '#000', fontWeight: 700, fontSize: 14, cursor: status === 'sending' ? 'default' : 'pointer', opacity: status === 'sending' ? 0.6 : 1 }}>{status === 'sending' ? 'Bhej rahe hain...' : 'Send Message'}</button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  )
}
