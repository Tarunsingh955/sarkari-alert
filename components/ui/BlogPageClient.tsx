'use client'
import { useTheme } from './ThemeProvider'
import AdBanner from './AdBanner'

export default function BlogPageClient({ posts, sp }: { posts: any[]; sp: any }) {
  const { colors } = useTheme()
  const CATS = ['Exam Guide', 'Preparation Tips', 'Career Advice', 'Application Process', 'General']

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: colors.textPrimary, marginBottom: 4 }}>Career Guides & Exam Tips</h1>
          <p style={{ color: colors.textMuted, fontSize: 13 }}>Exam preparation guides, application walkthroughs, aur career advice sarkari naukri ke liye</p>
        </div>
        <AdBanner position="header" />

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '16px 0' }}>
          <a href="/blog" style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: !sp.category ? colors.accent : colors.inputBg, border: `1px solid ${!sp.category ? colors.accent : colors.cardBorder}`, color: !sp.category ? '#000' : colors.textSecondary, textDecoration: 'none', fontWeight: !sp.category ? 700 : 400 }}>Sab</a>
          {CATS.map(c => <a key={c} href={`/blog?category=${encodeURIComponent(c)}`} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: sp.category === c ? colors.accent : colors.inputBg, border: `1px solid ${sp.category === c ? colors.accent : colors.cardBorder}`, color: sp.category === c ? '#000' : colors.textSecondary, textDecoration: 'none', fontWeight: sp.category === c ? 700 : 400 }}>{c}</a>)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {posts.map((p: any, i: number) => (
            <div key={p.id}>
              {i === 4 && <AdBanner position="between_jobs" height={60} />}
              <a href={`/blog/${p.slug}`} style={{ display: 'block', background: colors.cardBg, borderRadius: 12, padding: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}`, textDecoration: 'none' }}>
                <span style={{ background: colors.accent + '20', color: colors.accent, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>{p.category}</span>
                <h2 style={{ color: colors.textPrimary, fontSize: 17, fontWeight: 800, margin: '10px 0 6px', lineHeight: 1.4 }}>{p.title}</h2>
                {p.excerpt && <p style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 1.6, margin: '0 0 8px' }}>{p.excerpt}</p>}
                <span style={{ color: colors.textMuted, fontSize: 11 }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</span>
              </a>
            </div>
          ))}
        </div>

        {!posts.length && (
          <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
            <p style={{ fontSize: 16 }}>Is category mein abhi koi article nahi hai.</p>
            <a href="/blog" style={{ display: 'inline-block', marginTop: 12, padding: '10px 24px', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, borderRadius: 8, color: '#000', fontWeight: 700, textDecoration: 'none' }}>Sab Articles Dekho</a>
          </div>
        )}
      </main>
    </div>
  )
}
