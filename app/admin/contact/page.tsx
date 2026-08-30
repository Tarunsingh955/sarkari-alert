'use client'
import { useState, useEffect } from 'react'

export default function AdminContactPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    setLoading(true)
    const res = await fetch('/api/admin/contact')
    const data = await res.json()
    setMessages(data.messages || [])
    setLoading(false)
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete karein?')) return
    await fetch('/api/admin/contact', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    fetchMessages()
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>Contact Messages ({messages.length})</h1>
      <p style={{ color: '#64748b', fontSize: 12, marginBottom: 20 }}>Contact form se aaye hue saare messages yahan dikhenge</p>

      {loading ? <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((m: any) => (
            <div key={m.id} style={{ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <div>
                  <div style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 700 }}>{m.name} <span style={{ color: '#64748b', fontWeight: 400, fontSize: 12 }}>({m.email})</span></div>
                  {m.subject && <div style={{ color: '#f59e0b', fontSize: 12, marginTop: 2 }}>{m.subject}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#64748b', fontSize: 11 }}>{new Date(m.created_at).toLocaleDateString('en-IN')}</span>
                  <a href={`mailto:${m.email}`} style={{ background: '#3b82f622', border: '1px solid #3b82f644', borderRadius: 6, padding: '4px 12px', color: '#3b82f6', fontSize: 12, textDecoration: 'none' }}>Reply</a>
                  <button onClick={() => deleteMessage(m.id)} style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 6, padding: '4px 12px', color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                </div>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{m.message}</p>
            </div>
          ))}
          {!messages.length && <div style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>Koi message nahi aaya abhi tak.</div>}
        </div>
      )}
    </div>
  )
}
