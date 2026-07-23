import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdBanner from '@/components/ui/AdBanner'
import type { Metadata } from 'next'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'Sarkari Result 2026 — Latest Govt Job Results',
  description: 'Check latest Sarkari Result for SSC, Railway, UPSC, Banking and all govt exams. Download result PDF and check merit list.',
}

async function getResults(searchParams: any) {
  let query = supabaseAdmin.from('results').select('*', { count: 'exact' }).eq('is_active', true).order('release_date', { ascending: false })
  if (searchParams.search) query = query.ilike('title', `%${searchParams.search}%`)
  const { data, count } = await query
  return { results: data || [], total: count || 0 }
}

export default async function ResultPage({ searchParams }: { searchParams: any }) {
  const { results, total } = await getResults(searchParams)
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>Sarkari Result</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>Latest Govt Job Results — SSC, Railway, UPSC, Banking</p>
        </div>
        <AdBanner position="header" />
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid #334155' }}>
          <form method="GET">
            <input name="search" defaultValue={searchParams.search || ''} placeholder="Search results..." style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </form>
        </div>
        <div style={{ color: '#64748b', fontSize: 13, marginBottom: 12 }}>{total} results available</div>
        {results.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map((r: any, i: number) => (
              <div key={r.id}>
                {i === 6 && <AdBanner position="between_jobs" height={60} />}
                <div style={{ background: '#1e293b', borderRadius: 12, padding: 18, border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{r.title}</h3>
                    {r.release_date && <span style={{ fontSize: 12, color: '#64748b' }}>Released: {r.release_date}</span>}
                    {r.details && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>{r.details}</p>}
                  </div>
                  {r.download_link ? (
                    <a href={r.download_link} target="_blank" rel="noreferrer" style={{ background: '#10b98122', border: '1px solid #10b98144', borderRadius: 8, padding: '8px 16px', color: '#10b981', fontWeight: 700, fontSize: 12, textDecoration: 'none', flexShrink: 0 }}>Check Result</a>
                  ) : <span style={{ color: '#475569', fontSize: 12, flexShrink: 0 }}>Coming Soon</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>No Results</div>
            <p>Abhi koi result nahi mila.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}