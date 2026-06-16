'use client'
import { useState } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

export default function AdvertisePage() {
  const [form, setForm] = useState({ company_name: '', contact_name: '', email: '', phone: '', website: '', budget: '', message: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch('/api/advertise', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { setStatus('success'); setForm({ company_name: '', contact_name: '', email: '', phone: '', website: '', budget: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
    setLoading(false)
  }

  const iS = { width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 12 }
  const lS = { display: 'block' as const, fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', marginBottom: 8 }}>📢 Advertise With Us</h1>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>50,000+ daily visitors • Government job seekers • High intent audience</p>
        </div>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, marginBottom: 32 }}>
          {[['50K+','Daily Visitors'],['1.5M+','Monthly Pageviews'],['18-35','Avg Age'],['85%','Mobile Users'],['All India','Audience Reach'],['Govt Job Seekers','Target Audience']].map(([v,l])=>(
            <div key={l} style={{ background: '#1e293b', borderRadius: 12, padding: 16, border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b' }}>{v}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Ad Positions */}
        <div style={{ background: '#1e293b', borderRadius: 14, padding: 24, marginBottom: 28, border: '1px solid #334155' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', marginBottom: 16 }}>Ad Positions Available</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[['Header Banner','High visibility — above fold'],['Sidebar Top','Right sidebar — 300x250'],['Between Jobs','Native look — in job feed'],['Job Detail Top','High intent — job page'],['Job Detail Bottom','High intent — below job'],['Footer Banner','Sitewide — all pages']].map(([pos,desc])=>(
              <div key={pos} style={{ background: '#0f172a', borderRadius: 8, padding: 12, border: '1px solid #334155' }}>
                <div style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{pos}</div>
                <div style={{ color: '#64748b', fontSize: 11 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Contact Form */}
        <div style={{ background: '#1e293b', borderRadius: 14, padding: 28, border: '1px solid #334155' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', marginBottom: 20 }}>Contact Us — Inquiry Form</h2>
          {status === 'success' && <div style={{ background: '#10b98120', border: '1px solid #10b98140', borderRadius: 8, padding: '12px 16px', color: '#34d399', marginBottom: 16, fontWeight: 700 }}>✅ Inquiry bhej di gayi! Hum 24 ghante mein contact karenge.</div>}
          {status === 'error' && <div style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: 8, padding: '12px 16px', color: '#ef4444', marginBottom: 16 }}>❌ Error. Please try again.</div>}
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
              {[['company_name','Company Name *','Acme Corp'],['contact_name','Contact Person *','Rahul Sharma'],['email','Email *','rahul@acme.com'],['phone','Phone *','9876543210'],['website','Website','https://acme.com']].map(([f,l,p])=>(
                <div key={f}><label style={lS}>{l}</label><input required={l.includes('*')} value={(form as any)[f]} onChange={e => setForm(fm => ({ ...fm, [f]: e.target.value }))} placeholder={p} style={iS} /></div>
              ))}
              <div><label style={lS}>Monthly Budget</label>
                <select value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))} style={{...iS,cursor:'pointer'}}>
                  <option value="">Select Budget</option>
                  {['Under Rs.5,000','Rs.5,000 - Rs.20,000','Rs.20,000 - Rs.50,000','Rs.50,000+'].map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <label style={lS}>Message / Requirements</label>
            <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Apne ad requirements batayein..." style={{...iS,height:100,resize:'vertical'}} />
            <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: loading ? '#334155' : 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, color: loading ? '#64748b' : '#000', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Sending...' : 'Submit Inquiry'}</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
