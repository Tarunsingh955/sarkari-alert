import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdBanner from '@/components/ui/AdBanner'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Sarkari Result 2025 — Latest Govt Exam Results | SarkariAlert',
  description: 'Latest Sarkari Results for SSC, Railway, Banking, UPSC, State exams.',
}

async function getResults() {
  const { data, count } = await supabaseAdmin
    .from('results')
    .select('*,jobs(title,slug,department,categories(name,color,icon))', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(100)
  return { items: data || [], total: count || 0 }
}

export default async function ResultPage() {
  const { items, total } = await getResults()
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>Sarkari Result 2025</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>Latest Govt Exam Results | {total} Results Available</p>
        </div>
        <AdBanner position="header" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12, marginTop: 16 }}>
          {items.map((item: any) => (
            <div key={item.id} style={{ background: '#1e293b', borderRadius: 12, padding: 18, border: '1px solid #334155' }}>
              {item.jobs?.categories && (
                <span style={{ background: (item.jobs.categories.color||'#f59e0b')+'22', color: item.jobs.categories.color||'#f59e0b', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
                  {item.jobs.categories.icon} {item.jobs.categories.name}
                </span>
              )}
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', margin: '10px 0 8px' }}>{item.title}</h2>
              {item.result_date && <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>📅 Result Date: {item.result_date}</p>}
              {item.jobs?.slug && (
                <a href={`/jobs/${item.jobs.slug}`} style={{ fontSize: 12, color: '#64748b', textDecoration: 'none' }}>Job Details →</a>
              )}
              <div style={{ marginTop: 12 }}>
                {item.result_link && (
                  <a href={item.result_link} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', padding: '9px 0', background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Check Result →</a>
                )}
              </div>
            </div>
          ))}
        </div>
        {!items.length && (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
            <p style={{ fontSize: 16 }}>Abhi koi Result available nahi hai.</p>
          </div>
        )}
        <AdBanner position="footer" />
      </main>
      <Footer />
    </div>
  )
}