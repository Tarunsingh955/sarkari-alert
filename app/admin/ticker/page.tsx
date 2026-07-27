'use client'
import { useState, useEffect } from 'react'

export default function AdminTickerPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })
  const showMsg = (text: string, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000) }

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    setLoading(true)
    const res = await fetch('/api/admin/ticker')
    const data = await res.json()
    setMessages(data.messages || [])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim()) return
    const res = await fetch('/api/admin/ticker', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: newMessage }) })
    const data = await res.json()
    if (data.success) { showMsg('Message add ho gaya!'); setNewMessage(''); fetchMessages() }
    else showMsg('Error: ' + data.error, 'error')
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch('/api/admin/ticker', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_active: !current }) })
    fetchMessages()
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete karein?')) return
    await fetch('/api/admin/ticker', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    showMsg('Deleted!')
    fetchMessages()
  }

  const iS: React.CSSProperties = { width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>Ticker Messages ({messages.length})</h1>
      <p style={{ color: '#64748b', fontSize: 12, marginBottom: 20 }}>Ye messages breaking news ticker mein latest jobs ke saath dikhenge</p>

      {msg.text && <div style={{ background: msg.type === 'error' ? '#ef444420' : '#10b98120', border: `1px solid ${msg.type === 'error' ? '#ef444440' : '#10b98140'}`, borderRadius: 8, padding: '10px 16px', color: msg.type === 'error' ? '#ef4444' : '#34d399', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>{msg.text}</div>}

      <form onSubmit={handleAdd} style={{ background: '#1e293b', borderRadius: 14, padding: 20, marginBottom: 20, border: '1px solid #334155', display: 'flex', gap: 10 }}>
        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Naya message likhein... e.g. Diwali ke liye site pe special offer!" style={{ ...iS, marginBottom: 0 }} />
        <button type="submit" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>+ Add</button>
      </form>

      {loading ? <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((m: any) => (
            <div key={m.id} style={{ background: '#1e293b', borderRadius: 10, padding: '14px 16px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, color: '#f1f5f9', fontSize: 13 }}>{m.message}</div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <button onClick={() => toggleActive(m.id, m.is_active)} style={{ background: m.is_active ? '#10b98120' : '#33415520', border: `1px solid ${m.is_active ? '#10b98140' : '#33415540'}`, borderRadius: 6, padding: '5px 12px', color: m.is_active ? '#10b981' : '#64748b', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>{m.is_active ? 'Active' : 'Inactive'}</button>
                <button onClick={() => deleteMessage(m.id)} style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 6, padding: '5px 12px', color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
          {!messages.length && <div style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>Koi custom message nahi. Upar se add karein.</div>}
        </div>
      )}
    </div>
  )
}
