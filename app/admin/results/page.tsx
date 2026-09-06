'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function AdminResultsPage() {
  const { colors } = useTheme()
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const blank = { title: '', release_date: '', download_link: '', details: '' }
  const [form, setForm] = useState<any>(blank)
  const showMsg = (text: string, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000) }
  useEffect(() => { fetchResults() }, [])

  async function fetchResults() {
    setLoading(true)
    const res = await fetch('/api/admin/results')
    const data = await res.json()
    setResults(data.results || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/results', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { showMsg('Result add ho gaya!'); setShowForm(false); setForm(blank); fetchResults() }
    else showMsg('Error: ' + data.error, 'error')
  }

  async function deleteResult(id: string) {
    if (!confirm('Delete karein?')) return
    await fetch('/api/admin/results', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    showMsg('Deleted!')
    fetchResults()
  }

  const iS: React.CSSProperties = { width: '100%', padding: '10px 14px', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }
  const lS: React.CSSProperties = { display: 'block', fontSize: 10, color: colors.textMuted, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }

  return (
    <div style={{ padding: 24 }}>
      {msg.text && <div style={{ background: msg.type === 'error' ? '#ef444420' : '#10b98120', border: `1px solid ${msg.type === 'error' ? '#ef444440' : '#10b98140'}`, borderRadius: 8, padding: '10px 16px', color: msg.type === 'error' ? '#ef4444' : '#34d399', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>{msg.text}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: colors.textPrimary, margin: 0 }}>📋 Results ({results.length})</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{showForm ? 'Cancel' : '+ Add Result'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: colors.cardBg, borderRadius: 14, padding: 24, marginBottom: 20, border: `1px solid ${colors.cardBorder}` }}>
          <h2 style={{ color: colors.accent, fontSize: 15, marginBottom: 18 }}>New Result Add Karo</h2>
          <label style={lS}>Title *</label>
          <input required value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} placeholder="SSC CGL 2024 Final Result Declared" style={iS} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div><label style={lS}>Release Date</label><input type="date" value={form.release_date} onChange={e => setForm((f: any) => ({ ...f, release_date: e.target.value }))} style={iS} /></div>
            <div><label style={lS}>Download Link</label><input value={form.download_link} onChange={e => setForm((f: any) => ({ ...f, download_link: e.target.value }))} placeholder="https://..." style={iS} /></div>
          </div>
          <label style={lS}>Details</label>
          <textarea value={form.details} onChange={e => setForm((f: any) => ({ ...f, details: e.target.value }))} placeholder="Result ke baare mein details..." style={{ ...iS, height: 80, resize: 'vertical' }} />
          <button type="submit" style={{ background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 8, padding: '12px 32px', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Add Result</button>
        </form>
      )}

      {loading ? <div style={{ textAlign: 'center', color: colors.textMuted, padding: 40 }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((r: any) => (
            <div key={r.id} style={{ background: colors.cardBg, borderRadius: 10, padding: '14px 16px', border: `1px solid ${colors.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 700 }}>{r.title}</div>
                <div style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>{r.release_date || 'No date'}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {r.download_link && <a href={r.download_link} target="_blank" rel="noreferrer" style={{ background: '#3b82f622', border: '1px solid #3b82f644', borderRadius: 6, padding: '4px 12px', color: '#3b82f6', fontSize: 12, textDecoration: 'none' }}>Link</a>}
                <button onClick={() => deleteResult(r.id)} style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 6, padding: '4px 12px', color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
          {!results.length && <div style={{ textAlign: 'center', padding: 32, color: colors.textMuted }}>Koi result nahi. Upar se add karein.</div>}
        </div>
      )}
    </div>
  )
}