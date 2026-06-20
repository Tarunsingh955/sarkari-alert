// app/current-affairs/page.tsx
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdBanner from '@/components/ui/AdBanner'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Current Affairs 2025 — Daily GK Updates | SarkariAlert',
  description: 'Daily Current Affairs aur GK questions exam preparation ke liye. SSC, Railway, Banking, UPSC exams ke liye useful.',
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

async function getCurrentAffairs(searchParams: any) {
  let query = supabaseAdmin.from('current_affairs').select('*', { count: 'exact' }).eq('is_active', true)
  if (searchParams.month) query = query.eq('month', searchParams.month)
  if (searchParams.topic) query = query.ilike('topic', `%${searchParams.topic}%`)
  query = query.order('created_at', { ascending: false }).limit(100)
  const { data, count } = await query
  return { items: data || [], total: count || 0 }
}

export default async function CurrentAffairsPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams
  const { items, total } = await getCurrentAffairs(sp)
  const currentYear = new Date().getFullYear()

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>Current Affairs {currentYear}</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>Daily GK Updates for Sarkari Exams | {total} Questions Available</p>
        </div>
        <AdBanner position="header" />

        <div style={{ background: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid #334155' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>Filter by Month:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="/current-affairs" style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: !sp.month ? '#f59e0b' : '#0f172a', border: `1px solid ${!sp.month ? '#f59e0b' : '#334155'}`, color: !sp.month ? '#000' : '#94a3b8', textDecoration: 'none', fontWeight: !sp.month ? 700 : 400 }}>Sab</a>
            {MONTHS.map(m => (
              <a key={m} href={`/current-affairs?month=${m}`} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: sp.month === m ? '#f59e0b' : '#0f172a', border: `1px solid ${sp.month === m ? '#f59e0b' : '#334155'}`, color: sp.month === m ? '#000' : '#94a3b8', textDecoration: 'none', fontWeight: sp.month === m ? 700 : 400 }}>{m}</a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item: any, i: number) => (
            <div key={item.id}>
              {i === 5 && <AdBanner position="between_jobs" height={60} />}
              <details style={{ background: '#1e293b', borderRadius: 10, padding: '14px 18px', border: '1px solid #334155', cursor: 'pointer' }}>
                <summary style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600, listStyle: 'none', userSelect: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span>Q{i + 1}. {item.question}</span>
                  {item.topic && <span style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: 10, padding: '2px 8px', borderRadius: 12, flexShrink: 0, fontWeight: 700 }}>{item.topic}</span>}
                </summary>
                <p style={{ color: '#10b981', fontSize: 13, lineHeight: 1.7, margin: '10px 0 0', fontWeight: 600 }}>Ans: {item.answer}</p>
              </details>
            </div>
          ))}
        </div>

        {!items.length && (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📰</div>
            <p style={{ fontSize: 16, marginBottom: 8 }}>Abhi koi Current Affairs available nahi hain.</p>
            <p style={{ fontSize: 13 }}>Jaldi hi naye questions add kiye jayenge!</p>
          </div>
        )}

        <AdBanner position="footer" />
      </main>
      <Footer />
    </div>
  )
}