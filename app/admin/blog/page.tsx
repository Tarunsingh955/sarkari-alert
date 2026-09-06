'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'

const CATS = ['Exam Guide', 'Preparation Tips', 'Career Advice', 'Application Process', 'General']

const emptyForm = { title: '', excerpt: '', content: '', category: 'Exam Guide', is_published: true }

export default function AdminBlogPage() {
  const { colors } = useTheme()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<any>(emptyForm)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const showMsg = (text: string, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000) }

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    const res = await fetch('/api/admin/blog')
    const data = await res.json()
    setPosts(data.posts || [])
    setLoading(false)
  }

  function startNew() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function startEdit(p: any) {
    setEditingId(p.id)
    setForm({ title: p.title, excerpt: p.excerpt || '', content: p.content, category: p.category, is_published: p.is_published })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingId) {
      const res = await fetch('/api/admin/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) })
      const data = await res.json()
      if (data.success) { showMsg('Article update ho gaya!'); setShowForm(false); fetchPosts() }
      else showMsg('Error: ' + data.error, 'error')
    } else {
      const res = await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { showMsg('Article publish ho gaya!'); setShowForm(false); setForm(emptyForm); fetchPosts() }
      else showMsg('Error: ' + data.error, 'error')
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Delete karein?')) return
    await fetch('/api/admin/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    showMsg('Deleted!')
    fetchPosts()
  }

  async function togglePublish(p: any) {
    await fetch('/api/admin/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, is_published: !p.is_published }) })
    fetchPosts()
  }

  const iS = { width: '100%', padding: '10px 14px', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 10 }
  const lS = { display: 'block' as const, fontSize: 10, color: colors.textMuted, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }

  return (
    <div style={{ padding: 24 }}>
      {msg.text && <div style={{ background: msg.type === 'error' ? '#ef444420' : '#10b98120', border: `1px solid ${msg.type === 'error' ? '#ef444440' : '#10b98140'}`, borderRadius: 8, padding: '10px 16px', color: msg.type === 'error' ? '#ef4444' : '#34d399', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>{msg.text}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: colors.textPrimary, margin: 0 }}>Guides & Articles ({posts.length})</h1>
        <button onClick={() => (showForm ? setShowForm(false) : startNew())} style={{ background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{showForm ? 'Cancel' : '+ Naya Article'}</button>
      </div>
      <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 20 }}>Ye original content hai jo AdSense approval aur SEO ke liye zaroori hai — exam guides, preparation tips, career advice</p>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: colors.cardBg, borderRadius: 14, padding: 24, marginBottom: 20, border: `1px solid ${colors.cardBorder}` }}>
          <h2 style={{ color: colors.accent, fontSize: 15, marginBottom: 18 }}>{editingId ? 'Article Edit Karo' : 'Naya Article Likho'}</h2>
          <label style={lS}>Title *</label>
          <input required value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} placeholder="e.g. SSC CGL 2026 Kaise Apply Karein" style={iS} />
          <label style={lS}>Category</label>
          <select value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))} style={{ ...iS, cursor: 'pointer' }}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
          <label style={lS}>Excerpt (short summary, listing page pe dikhega)</label>
          <textarea value={form.excerpt} onChange={e => setForm((f: any) => ({ ...f, excerpt: e.target.value }))} placeholder="1-2 line summary..." style={{ ...iS, height: 60, resize: 'vertical' }} />
          <label style={lS}>Full Content *</label>
          <textarea required value={form.content} onChange={e => setForm((f: any) => ({ ...f, content: e.target.value }))} placeholder="Poora article yahan likho. Naye paragraph ke liye Enter dabao..." style={{ ...iS, height: 320, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: colors.textSecondary, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
            <input type="checkbox" checked={form.is_published} onChange={e => setForm((f: any) => ({ ...f, is_published: e.target.checked }))} /> Publish Now
          </label>
          <button type="submit" style={{ background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 8, padding: '12px 32px', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>{editingId ? 'Update Article' : 'Publish Article'}</button>
        </form>
      )}

      {loading ? <div style={{ textAlign: 'center', color: colors.textMuted, padding: 40 }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {posts.map((p: any) => (
            <div key={p.id} style={{ background: colors.cardBg, borderRadius: 10, padding: '12px 16px', border: `1px solid ${colors.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 700 }}>{p.title}</div>
                <div style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>{p.category} • {new Date(p.created_at).toLocaleDateString('en-IN')} • {p.content?.split(/\s+/).length || 0} words</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => togglePublish(p)} style={{ background: p.is_published ? '#10b98120' : '#33415520', border: `1px solid ${p.is_published ? '#10b98140' : '#33415540'}`, borderRadius: 6, padding: '5px 12px', color: p.is_published ? '#10b981' : colors.textMuted, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>{p.is_published ? 'Published' : 'Draft'}</button>
                <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" style={{ background: '#3b82f622', border: '1px solid #3b82f644', borderRadius: 6, padding: '5px 12px', color: '#3b82f6', fontSize: 12, textDecoration: 'none' }}>View</a>
                <button onClick={() => startEdit(p)} style={{ background: `${colors.accent}22`, border: `1px solid ${colors.accent}44`, borderRadius: 6, padding: '5px 12px', color: colors.accent, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                <button onClick={() => deletePost(p.id)} style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 6, padding: '5px 12px', color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
          {!posts.length && <div style={{ textAlign: 'center', padding: 32, color: colors.textMuted }}>Koi article nahi hai. Upar se add karein.</div>}
        </div>
      )}
    </div>
  )
}
