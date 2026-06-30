// app/news/page.tsx
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdBanner from '@/components/ui/AdBanner'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Sarkari Naukri News — Latest Updates | SarkariAlert',
  description: 'Latest sarkari naukri news, government announcements aur updates ek jagah.',
}

async function getNews() {
  const { data, count } = await supabaseAdmin
    .from('news')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(50)
  return { items: data || [], total: count || 0 }
}

export default async function NewsPage() {
  const { items, total } = await getNews()

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>Sarkari Naukri News</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>Latest government updates aur announcements | {total} News</p>
        </div>
        <AdBanner position="header" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {items.map((item: any, i: number) => (
            <div key={item.id}>
              {i === 5 && <AdBanner position="between_jobs" height={60} />}
              <a href={`/news/${item.slug}`} style={{ display: 'block', background: '#1e293b', borderRadius: 10, padding: '16px 18px', border: '1px solid #334155', textDecoration: 'none' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  {item.is_urgent && <span style={{ background: '#ef444420', color: '#ef4444', fontSize: 10, padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>URGENT</span>}
                  {item.category && <span style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: 10, padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>{item.category}</span>}
                  <span style={{ color: '#64748b', fontSize: 11 }}>{new Date(item.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                <h2 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.5 }}>{item.title}</h2>
                {item.excerpt && <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>{item.excerpt}</p>}
              </a>
            </div>
          ))}
        </div>

        {!items.length && (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📰</div>
            <p style={{ fontSize: 16 }}>Abhi koi news available nahi hai.</p>
          </div>
        )}

        <AdBanner position="footer" />
      </main>
      <Footer />
    </div>
  )
}