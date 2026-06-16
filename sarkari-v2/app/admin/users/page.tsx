'use client'
import { useState, useEffect } from 'react'
export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const showMsg = (text: string, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000) }
  useEffect(() => { fetch('/api/admin/users').then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false) }) }, [])
  async function updateRole(id: string, role: string, is_premium: boolean) {
    const res = await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role, is_premium }) })
    const data = await res.json()
    if (data.success) { showMsg('User updated!'); setUsers(u => u.map(x => x.id === id ? { ...x, role, is_premium } : x)) }
    else showMsg('Error: ' + data.error, 'error')
  }
  return (
    <div style={{ padding: 24 }}>
      {msg.text && <div style={{ background: msg.type === 'error' ? '#ef444420' : '#10b98120', border: `1px solid ${msg.type === 'error' ? '#ef444440' : '#10b98140'}`, borderRadius: 8, padding: '10px 16px', color: msg.type === 'error' ? '#ef4444' : '#34d399', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>{msg.text}</div>}
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', marginBottom: 20 }}>👥 User Management ({users.length})</h1>
      {loading ? <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Loading...</div> : (
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #334155', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8 }}>
            {['User', 'Role', 'Premium', 'Joined'].map(h => <span key={h} style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{h}</span>)}
          </div>
          {users.map((u: any) => (
            <div key={u.id} style={{ padding: '12px 16px', borderBottom: '1px solid #0f172a', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, alignItems: 'center' }}>
              <div>
                <div style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                <div style={{ color: '#64748b', fontSize: 11 }}>{u.email}</div>
              </div>
              <select value={u.role} onChange={e => updateRole(u.id, e.target.value, u.is_premium)} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6, padding: '4px 8px', color: '#f1f5f9', fontSize: 12, cursor: 'pointer' }}>
                {['user', 'editor', 'admin', 'super_admin'].map(r => <option key={r}>{r}</option>)}
              </select>
              <button onClick={() => updateRole(u.id, u.role, !u.is_premium)} style={{ background: u.is_premium ? '#f59e0b20' : '#33415520', border: `1px solid ${u.is_premium ? '#f59e0b40' : '#334155'}`, borderRadius: 6, padding: '4px 8px', color: u.is_premium ? '#f59e0b' : '#64748b', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>{u.is_premium ? '⭐ Premium' : 'Free'}</button>
              <div style={{ color: '#64748b', fontSize: 11 }}>{new Date(u.created_at).toLocaleDateString('en-IN')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
