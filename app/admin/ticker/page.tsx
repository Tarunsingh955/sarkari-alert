'use client'
import { useState, useEffect } from 'react'

export default function AdminTickerPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })

  const [jobLimit, setJobLimit] = useState(5)
  const [pinnedJobs, setPinnedJobs] = useState<any[]>([])
  const [autoJobs, setAutoJobs] = useState<any[]>([])
  const [excludedJobIds, setExcludedJobIds] = useState<string[]>([])
  const [jobSearch, setJobSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)

  const showMsg = (text: string, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000) }

  useEffect(() => { fetchMessages(); fetchSettings() }, [])

  async function fetchMessages() {
    setLoading(true)
    const res = await fetch('/api/admin/ticker')
    const data = await res.json()
    setMessages(data.messages || [])
    setLoading(false)
  }

  async function fetchSettings() {
    const res = await fetch('/api/admin/ticker-settings')
    const data = await res.json()
    setJobLimit(data.job_limit ?? 5)
    setPinnedJobs(data.pinned_jobs || [])
    setAutoJobs(data.auto_jobs || [])
    setExcludedJobIds(data.excluded_job_ids || [])
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

  function startEdit(m: any) {
    setEditingId(m.id)
    setEditText(m.message)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  async function saveEdit(id: string) {
    if (!editText.trim()) return
    const res = await fetch('/api/admin/ticker', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, message: editText }) })
    const data = await res.json()
    if (data.success) { showMsg('Message update ho gaya!'); cancelEdit(); fetchMessages() }
    else showMsg('Error: ' + data.error, 'error')
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete karein?')) return
    await fetch('/api/admin/ticker', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    showMsg('Deleted!')
    fetchMessages()
  }

  async function searchJobs() {
    if (!jobSearch.trim()) { setSearchResults([]); return }
    setSearching(true)
    const res = await fetch(`/api/admin/jobs?search=${encodeURIComponent(jobSearch)}`)
    const data = await res.json()
    setSearchResults(data.jobs || [])
    setSearching(false)
  }

  function addPinnedJob(job: any) {
    if (pinnedJobs.some(j => j.id === job.id)) return
    setPinnedJobs(p => [...p, job])
    setSearchResults([])
    setJobSearch('')
  }

  function removePinnedJob(id: string) {
    setPinnedJobs(p => p.filter(j => j.id !== id))
  }

  function moveJob(index: number, dir: -1 | 1) {
    setPinnedJobs(p => {
      const next = [...p]
      const target = index + dir
      if (target < 0 || target >= next.length) return p
      const tmp = next[index]; next[index] = next[target]; next[target] = tmp
      return next
    })
  }

  async function saveSettings() {
    setSavingSettings(true)
    const res = await fetch('/api/admin/ticker-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_limit: jobLimit, pinned_job_ids: pinnedJobs.map(j => j.id), excluded_job_ids: excludedJobIds })
    })
    const data = await res.json()
    setSavingSettings(false)
    if (data.success) { showMsg('Ticker job settings save ho gayi!'); fetchSettings() }
    else showMsg('Error: ' + data.error, 'error')
  }

  async function excludeAutoJob(id: string) {
    const nextExcluded = [...excludedJobIds, id]
    setExcludedJobIds(nextExcluded)
    setAutoJobs(prev => prev.filter(j => j.id !== id))
    const res = await fetch('/api/admin/ticker-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ excluded_job_ids: nextExcluded })
    })
    const data = await res.json()
    if (data.success) { showMsg('Job ticker se hata di gayi!'); fetchSettings() }
    else showMsg('Error: ' + data.error, 'error')
  }

  const iS: React.CSSProperties = { width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>Ticker Control</h1>
      <p style={{ color: '#64748b', fontSize: 12, marginBottom: 20 }}>Custom messages aur ticker mein dikhne wali jobs, dono yahan se control karein</p>

      {msg.text && <div style={{ background: msg.type === 'error' ? '#ef444420' : '#10b98120', border: `1px solid ${msg.type === 'error' ? '#ef444440' : '#10b98140'}`, borderRadius: 8, padding: '10px 16px', color: msg.type === 'error' ? '#ef4444' : '#34d399', fontSize: 13, marginBottom: 20, fontWeight: 600 }}>{msg.text}</div>}

      {/* JOB TICKER CONTROL */}
      <div style={{ background: '#1e293b', borderRadius: 14, padding: 20, marginBottom: 24, border: '1px solid #334155' }}>
        <h2 style={{ color: '#f59e0b', fontSize: 15, marginBottom: 4 }}>Job Ticker Control</h2>
        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Kitni jobs ticker mein chalengi, aur konsi specific jobs pin karni hain (pin ki hui jobs list ke start mein dikhengi, baaki slots latest jobs se bharenge)</p>

        <label style={{ display: 'block', fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total jobs ticker mein (0-20)</label>
        <input
          type="number" min={0} max={20} value={jobLimit}
          onChange={e => setJobLimit(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
          style={{ ...iS, width: 120, marginBottom: 16 }}
        />

        <label style={{ display: 'block', fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Specific jobs pin karein</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            value={jobSearch}
            onChange={e => setJobSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); searchJobs() } }}
            placeholder="Job title search karein..."
            style={{ ...iS, marginBottom: 0 }}
          />
          <button onClick={searchJobs} type="button" style={{ background: '#33415520', border: '1px solid #33415560', borderRadius: 8, padding: '10px 18px', color: '#cbd5e1', fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>{searching ? '...' : 'Search'}</button>
        </div>

        {searchResults.length > 0 && (
          <div style={{ background: '#0f172a', borderRadius: 8, border: '1px solid #334155', marginBottom: 14, maxHeight: 220, overflowY: 'auto' }}>
            {searchResults.map(j => (
              <div key={j.id} onClick={() => addPinnedJob(j)} style={{ padding: '10px 14px', borderBottom: '1px solid #1e293b', cursor: 'pointer', fontSize: 13, color: '#cbd5e1', display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span>{j.title}</span>
                <span style={{ color: '#f59e0b', fontSize: 12, flexShrink: 0 }}>+ Add</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {pinnedJobs.length === 0 && <div style={{ color: '#475569', fontSize: 12 }}>Koi job pin nahi hai — sirf latest jobs auto-dikhengi.</div>}
          {pinnedJobs.map((j, i) => (
            <div key={j.id} style={{ background: '#0f172a', borderRadius: 8, padding: '8px 12px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#f59e0b', fontSize: 11, fontWeight: 700, width: 18, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, color: '#f1f5f9', fontSize: 13, minWidth: 0 }}>{j.title}</span>
              <button onClick={() => moveJob(i, -1)} disabled={i === 0} type="button" style={{ background: 'transparent', border: 'none', color: i === 0 ? '#334155' : '#94a3b8', cursor: i === 0 ? 'default' : 'pointer', fontSize: 14, padding: '2px 6px' }}>↑</button>
              <button onClick={() => moveJob(i, 1)} disabled={i === pinnedJobs.length - 1} type="button" style={{ background: 'transparent', border: 'none', color: i === pinnedJobs.length - 1 ? '#334155' : '#94a3b8', cursor: i === pinnedJobs.length - 1 ? 'default' : 'pointer', fontSize: 14, padding: '2px 6px' }}>↓</button>
              <button onClick={() => removePinnedJob(j.id)} type="button" style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 6, padding: '4px 10px', color: '#ef4444', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Remove</button>
            </div>
          ))}
        </div>

        <button onClick={saveSettings} disabled={savingSettings} type="button" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#000', fontWeight: 700, fontSize: 13, cursor: savingSettings ? 'default' : 'pointer', opacity: savingSettings ? 0.6 : 1 }}>{savingSettings ? 'Saving...' : 'Save Job Settings'}</button>
      </div>

      {/* CURRENTLY RUNNING IN TICKER */}
      <div style={{ background: '#1e293b', borderRadius: 14, padding: 20, marginBottom: 24, border: '1px solid #334155' }}>
        <h2 style={{ color: '#10b981', fontSize: 15, marginBottom: 4 }}>Abhi Ticker Mein Kya Chal Raha Hai ({pinnedJobs.length + autoJobs.length}/{jobLimit})</h2>
        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 14 }}>Ye poori list hai jo live site pe ticker mein dikh rahi hai — pehle pinned jobs, fir bachi hui jagah latest jobs se bharti hai</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {pinnedJobs.map((j, i) => (
            <div key={'p-' + j.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0f172a', borderRadius: 8, padding: '8px 12px', border: '1px solid #334155' }}>
              <span style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>PINNED</span>
              <span style={{ color: '#f1f5f9', fontSize: 13, flex: 1, minWidth: 0 }}>{j.title}</span>
            </div>
          ))}
          {autoJobs.map(j => (
            <div key={'a-' + j.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0f172a', borderRadius: 8, padding: '8px 12px', border: '1px solid #334155' }}>
              <span style={{ background: '#33415520', color: '#94a3b8', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>LATEST</span>
              <span style={{ color: '#cbd5e1', fontSize: 13, flex: 1, minWidth: 0 }}>{j.title}</span>
              <button onClick={() => excludeAutoJob(j.id)} type="button" style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 6, padding: '4px 10px', color: '#ef4444', fontSize: 11, cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>Ticker se hatao</button>
            </div>
          ))}
          {pinnedJobs.length + autoJobs.length === 0 && <div style={{ color: '#475569', fontSize: 12 }}>Koi job ticker mein nahi chal rahi (Total jobs 0 set hai).</div>}
        </div>
        {excludedJobIds.length > 0 && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #334155' }}>
            <div style={{ color: '#64748b', fontSize: 11, marginBottom: 8 }}>{excludedJobIds.length} job(s) hamesha ke liye ticker se hataye gaye hain (in jobs ki 'LATEST' waali auto-list mein kabhi nahi aayengi)</div>
            <button onClick={async () => {
              setExcludedJobIds([])
              const res = await fetch('/api/admin/ticker-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ excluded_job_ids: [] }) })
              const data = await res.json()
              if (data.success) { showMsg('Sab exclusions hata diye!'); fetchSettings() }
            }} type="button" style={{ background: '#33415520', border: '1px solid #33415560', borderRadius: 6, padding: '5px 12px', color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>Sab ko wapis allow karo</button>
          </div>
        )}
      </div>

      {/* CUSTOM MESSAGES */}
      <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Custom Messages ({messages.length})</h2>
      <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Ye messages ticker mein jobs ke saath dikhenge</p>

      <form onSubmit={handleAdd} style={{ background: '#1e293b', borderRadius: 14, padding: 20, marginBottom: 20, border: '1px solid #334155', display: 'flex', gap: 10 }}>
        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Naya message likhein... e.g. Diwali ke liye site pe special offer!" style={{ ...iS, marginBottom: 0 }} />
        <button type="submit" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>+ Add</button>
      </form>

      {loading ? <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((m: any) => (
            <div key={m.id} style={{ background: '#1e293b', borderRadius: 10, padding: '14px 16px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {editingId === m.id ? (
                <>
                  <input value={editText} onChange={e => setEditText(e.target.value)} style={{ ...iS, flex: 1, minWidth: 200, marginBottom: 0 }} autoFocus />
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => saveEdit(m.id)} style={{ background: '#10b98120', border: '1px solid #10b98140', borderRadius: 6, padding: '5px 12px', color: '#10b981', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Save</button>
                    <button onClick={cancelEdit} style={{ background: '#33415520', border: '1px solid #33415540', borderRadius: 6, padding: '5px 12px', color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ flex: 1, minWidth: 200, color: '#f1f5f9', fontSize: 13 }}>{m.message}</div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                    <button onClick={() => toggleActive(m.id, m.is_active)} style={{ background: m.is_active ? '#10b98120' : '#33415520', border: `1px solid ${m.is_active ? '#10b98140' : '#33415540'}`, borderRadius: 6, padding: '5px 12px', color: m.is_active ? '#10b981' : '#64748b', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>{m.is_active ? 'Active' : 'Inactive'}</button>
                    <button onClick={() => startEdit(m)} style={{ background: '#f59e0b22', border: '1px solid #f59e0b44', borderRadius: 6, padding: '5px 12px', color: '#f59e0b', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                    <button onClick={() => deleteMessage(m.id)} style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 6, padding: '5px 12px', color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {!messages.length && <div style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>Koi custom message nahi. Upar se add karein.</div>}
        </div>
      )}
    </div>
  )
}
