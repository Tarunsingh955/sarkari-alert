// app/admit-card/page.tsx
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdBanner from '@/components/ui/AdBanner'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Admit Card 2025 — Download Sarkari Exam Admit Cards | SarkariAlert',
  description: 'Latest Admit Cards for SSC, Railway, Banking, UPSC, State exams. Download admit card directly.',
}

async function getAdmitCards(searchParams: any) {
  let query = supabaseAdmin
    .from('admit_cards')
    .select('*,jobs(title,slug,department,categories(name,color,icon))', { count: 'exact' })
    .eq('is_active', true)
  if (searchParams.search) query = query.ilike('title', `%${searchParams.search}%`)
  query = query.order('release_date', { ascending: false }).limit(100)
  const { data, count } = await query
  return { items: data || [], total: count || 0 }
}

export default async function AdmitCardPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams
  const { items, total } = await getAdmitCards(sp)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>Admit Card 2025</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>Latest Sarkari Exam Admit Cards | {total} Available</p>
        </div>
        <AdBanner position="header" />

        <form method="GET" style={{ marginBottom: 16 }}>
          <input name="search" defaultValue={sp.search || ''} placeholder="🔍 Search admit card by exam name..."
            style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
          {items.map((item: any, i: number) => (
            <div key={item.id}>
              {i === 6 && <div style={{ gridColumn: '1/-1' }}><AdBanner position="between_jobs" height={60} /></div>}
              <div style={{ background: '#1e293b', borderRadius: 12, padding: 18, border: '1px solid #334155' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {item.jobs?.categories && (
                    <span style={{ background: (item.jobs.categories.color || '#f59e0b') + '22', color: item.jobs.categories.color || '#f59e0b', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
                      {item.jobs.categories.icon} {item.jobs.categories.name}
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>{item.title}</h2>
                {item.exam_date && <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>📅 Exam Date: {item.exam_date}</p>}
                {item.release_date && <p style={{ color: '#64748b', fontSize: 12, marginBottom: 12 }}>Released: {new Date(item.release_date).toLocaleDateString('en-IN')}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  {item.jobs?.slug && (
                    <a href={`/jobs/${item.jobs.slug}`} style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>Job Details</a>
                  )}
                  {item.download_link && (
                    <a href={item.download_link} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 8, color: '#000', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Download →</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!items.length && (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎫</div>
            <p style={{ fontSize: 16, marginBottom: 8 }}>Abhi koi Admit Card available nahi hai.</p>
            <a href="/jobs" style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, color: '#000', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>Sab Jobs Dekho</a>
          </div>
        )}

        <AdBanner position="footer" />
      </main>
      <Footer />
    </div>
  )
}