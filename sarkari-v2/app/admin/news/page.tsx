'use client'
import { useState, useEffect } from 'react'
const CATS = ['SSC','Railway','UPSC','Banking','State','Teaching','Defence','General']
export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [form, setForm] = useState({ title: '', category: 'SSC', external_link: '', content: '', is_urgent: false, is_published: true, expires_days: 30 })
  const showMsg = (text: string, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000) }
  useEffect(() => { fetchNews() }, [])
  async function fetchNews() { setLoading(true); const res = await fetch('/api/admin/news'); const data = await res.json(); setNews(data.news || []); setLoading(false) }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { showMsg('News add ho gayi!'); setShowForm(false); fetchNews(); setForm({ title: '', category: 'SSC', external_link: '', content: '', is_urgent: false, is_published: true, expires_days: 30 }) }
    else showMsg('Error: ' + data.error, 'error')
  }
  async function deleteNews(id: string) { if (!confirm('Delete?')) return; await fetch('/api/admin/news', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); showMsg('Deleted!'); fetchNews() }
  const iS = { width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 10 }
  const lS = { display: 'block' as const, fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }
  return (
    <div style={{ padding: 24 }}>
      {msg.text && <div style={{ background: msg.type === 'error' ? '#ef444420' : '#10b98120', border: `1px solid ${msg.type === 'error' ? '#ef444440' : '#10b98140'}`, borderRadius: 8, padding: '10px 16px', color: msg.type === 'error' ? '#ef4444' : '#34d399', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>{msg.text}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', margin: 0 }}>Manage News ({news.length})</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, padding: '10px 20px', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{showForm ? 'Cancel' : '+ Add News'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#1e293b', borderRadius: 14, padding: 24, marginBottom: 20, border: '1px solid #334155' }}>
          <h2 style={{ color: '#f59e0b', fontSize: 15, marginBottom: 18 }}>New News Add Karo</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div style={{ gridColumn: '1/-1' }}><label style={lS}>Title *</label><input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="SSC CGL 2025 Notification Out..." style={iS} /></div>
            <div><label style={lS}>Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...iS, cursor: 'pointer' }}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label style={lS}>Official Link</label><input value={form.external_link} onChange={e => setForm(f => ({ ...f, external_link: e.target.value }))} placeholder="https://ssc.nic.in/..." style={iS} /></div>
            <div><label style={lS}>Expires in Days</label><input type="number" value={form.expires_days} onChange={e => setForm(f => ({ ...f, expires_days: Number(e.target.value) }))} style={iS} /></div>
          </div>
          <label style={lS}>Content (Optional)</label>
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="News content..." style={{ ...iS, height: 80, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
            {[['is_urgent', 'Urgent News'], ['is_published', 'Publish Now']].map(([k, l]) => (
              <label key={k} style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}><input type="checkbox" checked={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.checked }))} /> {l}</label>
            ))}
          </div>
          <button type="submit" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, padding: '12px 32px', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Add News</button>
        </form>
      )}
      {loading ? <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {news.map((n: any) => (
            <div key={n.id} style={{ background: '#1e293b', borderRadius: 10, padding: '12px 16px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{n.category} • {new Date(n.created_at).toLocaleDateString('en-IN')}{n.is_urgent ? ' • 🔴 URGENT' : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {n.external_link && <a href={n.external_link} target="_blank" rel="noreferrer" style={{ background: '#3b82f622', border: '1px solid #3b82f644', borderRadius: 6, padding: '4px 12px', color: '#3b82f6', fontSize: 12, textDecoration: 'none' }}>Link</a>}
                <button onClick={() => deleteNews(n.id)} style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 6, padding: '4px 12px', color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
