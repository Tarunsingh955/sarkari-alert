'use client'
import { useState, useEffect } from 'react'

export default function AdminCurrentAffairsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const blank = { question: '', answer: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', explanation: '', topic: '', month: new Date().toLocaleString('en-US', { month: 'long' }), year: new Date().getFullYear() }
  const [form, setForm] = useState<any>(blank)
  const showMsg = (text: string, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000) }
  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    setLoading(true)
    const res = await fetch('/api/current-affairs')
    const data = await res.json()
    setItems(data.items || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/current-affairs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { showMsg('Question add ho gaya!'); setShowForm(false); setForm(blank); fetchItems() }
    else showMsg('Error: ' + data.error, 'error')
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete karein?')) return
    await fetch('/api/admin/current-affairs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    fetchItems()
  }

  const iS = { width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 10 }
  const lS = { display: 'block' as const, fontSize: 10, color: '#64748b', fontWeight: 600 as const, marginBottom: 4, textTransform: 'uppercase' as const }

  return (
    <div style={{ padding: 24 }}>
      {msg.text && <div style={{ background: msg.type === 'error' ? '#ef444420' : '#10b98120', border: `1px solid ${msg.type === 'error' ? '#ef444440' : '#10b98140'}`, borderRadius: 8, padding: '10px 16px', color: msg.type === 'error' ? '#ef4444' : '#34d399', fontSize: 13, marginBottom: 16 }}>{msg.text}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div><h1 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', margin: 0 }}>Current Affairs MCQ ({items.length})</h1></div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, padding: '10px 20px', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{showForm ? 'Cancel' : '+ Add Question'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#1e293b', borderRadius: 14, padding: 24, marginBottom: 20, border: '1px solid #334155' }}>
          <h2 style={{ color: '#f59e0b', fontSize: 15, marginBottom: 16 }}>New MCQ Question</h2>
          <label style={lS}>Question *</label>
          <textarea value={form.question} onChange={e => setForm((f: any) => ({ ...f, question: e.target.value }))} required placeholder="Question likho..." style={{ ...iS, height: 70, resize: 'vertical' as const }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div><label style={lS}>Option A *</label><input value={form.option_a} onChange={e => setForm((f: any) => ({ ...f, option_a: e.target.value }))} required placeholder="Option A" style={iS} /></div>
            <div><label style={lS}>Option B *</label><input value={form.option_b} onChange={e => setForm((f: any) => ({ ...f, option_b: e.target.value }))} required placeholder="Option B" style={iS} /></div>
            <div><label style={lS}>Option C</label><input value={form.option_c} onChange={e => setForm((f: any) => ({ ...f, option_c: e.target.value }))} placeholder="Option C" style={iS} /></div>
            <div><label style={lS}>Option D</label><input value={form.option_d} onChange={e => setForm((f: any) => ({ ...f, option_d: e.target.value }))} placeholder="Option D" style={iS} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
            <div>
              <label style={lS}>Correct Option *</label>
              <select value={form.correct_option} onChange={e => setForm((f: any) => ({ ...f, correct_option: e.target.value }))} style={{ ...iS, cursor: 'pointer' }}>
                {['A', 'B', 'C', 'D'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={lS}>Topic</label><input value={form.topic} onChange={e => setForm((f: any) => ({ ...f, topic: e.target.value }))} placeholder="Economy, Science..." style={iS} /></div>
            <div><label style={lS}>Month</label><input value={form.month} onChange={e => setForm((f: any) => ({ ...f, month: e.target.value }))} placeholder="July" style={iS} /></div>
          </div>
          <label style={lS}>Answer (short) *</label>
          <input value={form.answer} onChange={e => setForm((f: any) => ({ ...f, answer: e.target.value }))} required placeholder="Correct answer text" style={iS} />
          <label style={lS}>Explanation</label>
          <textarea value={form.explanation} onChange={e => setForm((f: any) => ({ ...f, explanation: e.target.value }))} placeholder="Is question ka explanation..." style={{ ...iS, height: 80, resize: 'vertical' as const }} />
          <button type="submit" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, padding: '12px 32px', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Add Question</button>
        </form>
      )}

      {loading ? <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item: any) => (
            <div key={item.id} style={{ background: '#1e293b', borderRadius: 10, padding: '14px 16px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600, margin: 0 }}>{item.question}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  {item.topic && <span style={{ background: '#8b5cf620', color: '#8b5cf6', fontSize: 11, padding: '2px 8px', borderRadius: 12 }}>{item.topic}</span>}
                  <span style={{ background: '#10b98120', color: '#10b981', fontSize: 11, padding: '2px 8px', borderRadius: 12 }}>Ans: {item.correct_option}</span>
                  <span style={{ color: '#64748b', fontSize: 11 }}>{item.month} {item.year}</span>
                </div>
              </div>
              <button onClick={() => deleteItem(item.id)} style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 6, padding: '5px 12px', color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
          {!items.length && <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Abhi koi question nahi hai — "+ Add Question" se add karo!</div>}
        </div>
      )}
    </div>
  )
}