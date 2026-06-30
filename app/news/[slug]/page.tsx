// app/news/[slug]/page.tsx
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdBanner from '@/components/ui/AdBanner'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: news } = await supabaseAdmin.from('news').select('*').eq('slug', slug).single()
  if (!news) return { title: 'News Not Found' }
  return {
    title: news.meta_title || news.title,
    description: news.meta_description || news.excerpt || news.title,
    alternates: { canonical: `/news/${news.slug}` }
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: news } = await supabaseAdmin.from('news').select('*').eq('slug', slug).eq('is_published', true).single()
  if (!news) notFound()

  supabaseAdmin.from('news').update({ views: (news.views || 0) + 1 }).eq('id', news.id).then(() => {})

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
        <nav style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
          <a href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</a> › <a href="/news" style={{ color: '#94a3b8', textDecoration: 'none' }}>News</a>
        </nav>

        <div style={{ background: '#1e293b', borderRadius: 16, padding: 24, marginBottom: 20, border: '1px solid #334155' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {news.is_urgent && <span style={{ background: '#ef444420', color: '#ef4444', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>URGENT</span>}
            {news.category && <span style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{news.category}</span>}
            <span style={{ color: '#64748b', fontSize: 12 }}>{new Date(news.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 900, color: '#f1f5f9', lineHeight: 1.4 }}>{news.title}</h1>
        </div>

        <AdBanner position="job_detail_top" />

        <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid #334155' }}>
          <div style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-wrap' }}>{news.content}</div>
        </div>

        {news.external_link && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <a href={news.external_link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '12px 32px', background: '#1e293b', border: '1px solid #334155', borderRadius: 10, color: '#94a3b8', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Original Source →
            </a>
          </div>
        )}

        <AdBanner position="footer" />
      </main>
      <Footer />
    </div>
  )
}