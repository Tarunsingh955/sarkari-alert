'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

const TEMPLATES = {
  classic: { name: 'Classic Navy', color: '#1e3a5f', font: 'Georgia,serif', premium: false, layout: 'centered' },
  modern: { name: 'Modern Blue', color: '#0369a1', font: 'Arial,sans-serif', premium: true, layout: 'sidebar' },
  elegant: { name: 'Elegant Green', color: '#166534', font: '"Times New Roman",serif', premium: true, layout: 'banner' },
}
type TemplateKey = keyof typeof TEMPLATES

function ResumeSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color, borderBottom: `2px solid ${color}`, paddingBottom: 4, marginBottom: 8, letterSpacing: '0.05em' }}>{title}</h2>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }

export default function ResumeBuildPage() {
  const [data, setData] = useState({
    name: '', phone: '', email: '', city: '', dob: '', objective: '', skills: '', experience: '', hobbies: '',
    certifications: '', projects: '', languages: '', photo: '',
    education: [{ degree: '', college: '', board: '', year: '', percent: '' }]
  })
  const [step, setStep] = useState(1)
  const [isPremium, setIsPremium] = useState(false)
  const [template, setTemplate] = useState<TemplateKey>('classic')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user?.is_premium) setIsPremium(true)
    }).catch(() => {})
  }, [])

  const up = (field: string, value: any) => setData(d => ({ ...d, [field]: value }))
  const activeTemplate = TEMPLATES[template]
  const contactLine = [data.phone, data.email, data.city, data.dob && `DOB: ${data.dob}`].filter(Boolean).join(' | ')

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('Photo 2MB se chhoti honi chahiye'); return }
    const reader = new FileReader()
    reader.onload = () => up('photo', reader.result as string)
    reader.readAsDataURL(file)
  }

  function renderHeader() {
    if (activeTemplate.layout === 'sidebar') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, borderBottom: `3px solid ${activeTemplate.color}`, paddingBottom: 18, marginBottom: 20 }}>
          {isPremium && data.photo && <img src={data.photo} alt="Photo" style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover' }} />}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: activeTemplate.color, marginBottom: 8 }}>{data.name || 'Aapka Naam'}</h1>
            <div style={{ display: 'inline-block', background: `${activeTemplate.color}12`, borderRadius: 6, padding: '5px 12px', fontSize: 12, color: activeTemplate.color, fontWeight: 600 }}>{contactLine}</div>
          </div>
        </div>
      )
    }
    if (activeTemplate.layout === 'banner') {
      return (
        <div style={{ background: activeTemplate.color, margin: '-40px -40px 20px -40px', padding: '32px 40px', textAlign: 'center' }}>
          {isPremium && data.photo && <img src={data.photo} alt="Photo" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', marginBottom: 10 }} />}
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{data.name || 'Aapka Naam'}</h1>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{contactLine}</div>
        </div>
      )
    }
    // classic / centered
    return (
      <div style={{ borderBottom: `3px solid ${activeTemplate.color}`, paddingBottom: 18, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center' }}>
        {isPremium && data.photo && <img src={data.photo} alt="Photo" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${activeTemplate.color}` }} />}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: activeTemplate.color, marginBottom: 6 }}>{data.name || 'Aapka Naam'}</h1>
          <div style={{ fontSize: 13, color: '#475569' }}>{contactLine}</div>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
        <Header />
        <div className="resume-page-wrap" style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={() => setStep(1)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>← Edit Karo</button>
            <button onClick={() => window.print()} style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, padding: '8px 20px', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>🖨️ Print / Download PDF</button>
          </div>

          {isPremium && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              {(Object.keys(TEMPLATES) as TemplateKey[]).map(key => {
                const t = TEMPLATES[key]
                const selected = template === key
                return (
                  <button key={key} onClick={() => setTemplate(key)} style={{ padding: 0, cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}>
                    <div style={{ width: 120, height: 84, background: '#fff', borderRadius: 8, overflow: 'hidden', border: selected ? `3px solid ${t.color}` : '1px solid #334155', boxShadow: selected ? `0 0 0 2px ${t.color}40` : 'none' }}>
                      {t.layout === 'banner' ? (
                        <>
                          <div style={{ height: 40, background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 46, height: 6, background: 'rgba(255,255,255,0.85)', borderRadius: 2 }} />
                          </div>
                          <div style={{ padding: '8px 10px' }}>
                            <div style={{ width: '70%', height: 4, background: '#e2e8f0', borderRadius: 2, marginBottom: 5 }} />
                            <div style={{ width: '90%', height: 4, background: '#e2e8f0', borderRadius: 2 }} />
                          </div>
                        </>
                      ) : t.layout === 'sidebar' ? (
                        <div style={{ display: 'flex', padding: '10px' }}>
                          <div style={{ width: 20, height: 20, borderRadius: 6, background: t.color, flexShrink: 0, marginRight: 8 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ width: '80%', height: 5, background: t.color, borderRadius: 2, marginBottom: 6 }} />
                            <div style={{ width: '60%', height: 4, background: '#e2e8f0', borderRadius: 2, marginBottom: 4 }} />
                            <div style={{ width: '50%', height: 4, background: '#e2e8f0', borderRadius: 2 }} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ height: 22, background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 46, height: 6, background: 'rgba(255,255,255,0.85)', borderRadius: 2 }} />
                          </div>
                          <div style={{ padding: '8px 10px' }}>
                            <div style={{ width: '70%', height: 4, background: '#cbd5e1', borderRadius: 2, marginBottom: 5 }} />
                            <div style={{ width: '90%', height: 4, background: '#e2e8f0', borderRadius: 2, marginBottom: 5 }} />
                            <div style={{ width: '55%', height: 4, background: '#e2e8f0', borderRadius: 2, marginBottom: 8 }} />
                            <div style={{ width: '40%', height: 4, background: t.color, borderRadius: 2, opacity: 0.6 }} />
                          </div>
                        </>
                      )}
                    </div>
                    <div style={{ fontSize: 11, textAlign: 'center', marginTop: 6, color: selected ? t.color : '#94a3b8', fontWeight: selected ? 700 : 400 }}>{t.name}</div>
                  </button>
                )
              })}
            </div>
          )}

          {!isPremium && (
            <div style={{ background: '#1e293b', border: '1px solid #f59e0b40', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 12, color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span>🔒 Premium members ko photo, extra sections, 2 aur unique-design templates aur bina watermark ke resume milta hai</span>
              <a href="/membership" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 6, padding: '5px 14px', color: '#000', fontWeight: 700, textDecoration: 'none', fontSize: 12, flexShrink: 0 }}>Upgrade</a>
            </div>
          )}

          <div id="resume-print" style={{ background: '#fff', borderRadius: 12, padding: 40, color: '#000', fontFamily: activeTemplate.font, fontVariantNumeric: 'lining-nums', boxShadow: '0 4px 40px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
            {renderHeader()}
            {data.objective && <ResumeSection title="CAREER OBJECTIVE" color={activeTemplate.color}><p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>{data.objective}</p></ResumeSection>}
            <ResumeSection title="EDUCATION" color={activeTemplate.color}>
              {data.education.map((e, i) => e.degree && (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, flexWrap: 'wrap', gap: 4 }}>
                  <div><strong>{e.degree}</strong> — {e.college}{e.board && ` (${e.board})`}</div>
                  <div style={{ color: '#64748b' }}>{e.year}{e.percent && ` | ${e.percent}%`}</div>
                </div>
              ))}
            </ResumeSection>
            {data.skills && <ResumeSection title="SKILLS" color={activeTemplate.color}><p style={{ fontSize: 13, margin: 0 }}>{data.skills}</p></ResumeSection>}
            {data.experience && <ResumeSection title="EXPERIENCE" color={activeTemplate.color}><p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>{data.experience}</p></ResumeSection>}
            {isPremium && data.certifications && <ResumeSection title="CERTIFICATIONS" color={activeTemplate.color}><p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>{data.certifications}</p></ResumeSection>}
            {isPremium && data.projects && <ResumeSection title="PROJECTS" color={activeTemplate.color}><p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>{data.projects}</p></ResumeSection>}
            {isPremium && data.languages && <ResumeSection title="LANGUAGES" color={activeTemplate.color}><p style={{ fontSize: 13, margin: 0 }}>{data.languages}</p></ResumeSection>}
            {data.hobbies && <ResumeSection title="HOBBIES" color={activeTemplate.color}><p style={{ fontSize: 13, margin: 0 }}>{data.hobbies}</p></ResumeSection>}
            {!isPremium && (
              <div style={{ marginTop: 24, borderTop: '1px solid #e2e8f0', paddingTop: 10, textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>Generated by SarkariAlert — India's #1 Govt Job Portal</div>
            )}
          </div>
          <style>{`@media print{body *{visibility:hidden;}#resume-print,#resume-print *{visibility:visible;}#resume-print{position:absolute;top:0;left:0;width:100%;border-radius:0;box-shadow:none;}}`}</style>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px 16px 48px' }}>
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>Resume Builder</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>Apni details bharo aur resume preview karo</p>
        </div>
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 16, border: '1px solid #334155' }}>
          <h3 style={{ color: '#f59e0b', fontSize: 13, marginBottom: 14 }}>👤 Personal Information</h3>

          {isPremium && (
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Photo (optional)</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ ...inputStyle, padding: '8px 14px' }} />
              {data.photo && <img src={data.photo} alt="preview" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }} />}
            </div>
          )}

          <div className="resume-grid-2">
            {[['name', 'Poora Naam *', 'Ram Kumar Sharma'], ['phone', 'Phone *', '9876543210'], ['email', 'Email *', 'ram@gmail.com'], ['city', 'City', 'Lucknow, UP'], ['dob', 'Date of Birth', '01/01/2000']].map(([f, l, p]) => (
              <div key={f}>
                <label style={labelStyle}>{l}</label>
                <input value={(data as any)[f]} onChange={e => up(f, e.target.value)} placeholder={p} style={inputStyle} />
              </div>
            ))}
          </div>
          <label style={labelStyle}>Career Objective</label>
          <textarea value={data.objective} onChange={e => up('objective', e.target.value)} placeholder="Main ek mehnat karne wala dedicated candidate hoon..." style={{ ...inputStyle, height: 80, resize: 'vertical' }} />

          <h3 style={{ color: '#f59e0b', fontSize: 13, margin: '8px 0 12px' }}>🎓 Education</h3>
          {data.education.map((edu, i) => (
            <div key={i} className="resume-grid-edu">
              {[['degree', 'Degree', 'B.A.'], ['college', 'College', 'DU'], ['board', 'Board', 'CBSE'], ['year', 'Year', '2023'], ['percent', '%', '75']].map(([f, l, p]) => (
                <div key={f}>
                  <label style={{ ...labelStyle, fontSize: 9 }}>{l}</label>
                  <input value={(edu as any)[f]} onChange={e => { const ne = [...data.education]; (ne[i] as any)[f] = e.target.value; up('education', ne) }} placeholder={p} style={inputStyle} />
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => up('education', [...data.education, { degree: '', college: '', board: '', year: '', percent: '' }])} style={{ background: 'none', border: '1px dashed #334155', borderRadius: 6, padding: '5px 14px', color: '#64748b', fontSize: 12, cursor: 'pointer', marginBottom: 14 }}>+ Aur Add Karo</button>

          {[['skills', '💡 Skills', 'MS Office, Hindi Typing, Computer...'], ['experience', '💼 Experience (optional)', 'Pehle kahan kaam kiya...'], ['hobbies', '🎵 Hobbies', 'Reading, Cricket, Music...']].map(([f, l, p]) => (
            <div key={f}>
              <label style={labelStyle}>{l}</label>
              {f === 'experience'
                ? <textarea value={(data as any)[f]} onChange={e => up(f, e.target.value)} placeholder={p} style={{ ...inputStyle, height: 70, resize: 'vertical' }} />
                : <input value={(data as any)[f]} onChange={e => up(f, e.target.value)} placeholder={p} style={inputStyle} />}
            </div>
          ))}

          {isPremium ? (
            <>
              <h3 style={{ color: '#f59e0b', fontSize: 13, margin: '8px 0 12px' }}>⭐ Premium Sections</h3>
              {[['certifications', 'Certifications', 'Data Entry Certificate, Tally...'], ['projects', 'Projects', 'Koi project ya achievement...'], ['languages', 'Languages', 'Hindi, English, Punjabi...']].map(([f, l, p]) => (
                <div key={f}>
                  <label style={labelStyle}>{l}</label>
                  <input value={(data as any)[f]} onChange={e => up(f, e.target.value)} placeholder={p} style={inputStyle} />
                </div>
              ))}
            </>
          ) : (
            <div style={{ background: '#0f172a', border: '1px dashed #334155', borderRadius: 8, padding: '12px 16px', marginBottom: 14, fontSize: 12, color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span>🔒 Premium mein: Photo, Certifications, Projects, Languages sections</span>
              <a href="/membership" style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'none', fontSize: 12 }}>Upgrade →</a>
            </div>
          )}

          <button onClick={() => {
            if (!data.name || !data.phone || !data.email) { alert('Naam, Phone aur Email zaroori hai!'); return }
            setStep(2)
          }} style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, padding: '12px 24px',color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', width: '100%' }}>👉️ Preview & Download Resume</button>
        </div>
      </div>
      <Footer />
      <style>{`
        .resume-grid-2 { display:grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
        .resume-grid-edu { display:grid; grid-template-columns: 2fr 2fr 1fr 1fr 1fr; gap: 0 8px; }
        @media (max-width: 640px) {
          .resume-grid-2 { grid-template-columns: 1fr; }
          .resume-grid-edu { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  )
}
