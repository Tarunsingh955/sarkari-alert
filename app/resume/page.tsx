// app/resume/page.tsx
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdBanner from '@/components/ui/AdBanner'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Free Resume Builder — Sarkari Naukri Resume Banao | SarkariAlert',
  description: 'Free resume builder government job applications ke liye. Multiple templates, instant PDF download.',
}

async function getTemplates() {
  const { data } = await supabaseAdmin.from('resume_templates').select('*').eq('is_active', true).order('sort_order', { ascending: true })
  return data || []
}

export default async function ResumePage() {
  const templates = await getTemplates()

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#f1f5f9', marginBottom: 8 }}>📄 Free Resume Builder</h1>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Sarkari naukri ke liye professional resume banao — 2 minute mein!</p>
        </div>
        <AdBanner position="header" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginTop: 20 }}>
          {templates.map((t: any) => (
            <div key={t.id} style={{ background: '#1e293b', borderRadius: 14, padding: 18, border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ width: '100%', height: 140, background: '#0f172a', borderRadius: 10, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                📄
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>{t.name}</h3>
              {t.is_free ? (
                <span style={{ background: '#10b98120', color: '#10b981', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>FREE</span>
              ) : (
                <span style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>₹{t.price}</span>
              )}
              <div style={{ marginTop: 14 }}>
                <a href={`/resume/build?template=${t.id}`} style={{ display: 'block', padding: '10px 0', background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 8, color: '#000', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                  Use Template →
                </a>
              </div>
            </div>
          ))}
        </div>

        {!templates.length && (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
            <p style={{ fontSize: 16 }}>Resume templates jaldi hi available honge!</p>
          </div>
        )}

        <AdBanner position="footer" />
      </main>
      <Footer />
    </div>
  )
}