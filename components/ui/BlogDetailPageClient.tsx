'use client'
import { useTheme } from './ThemeProvider'
import AdBanner from './AdBanner'

export default function BlogDetailPageClient({ post }: { post: any }) {
  const { colors } = useTheme()
  const paragraphs = post.content.split(/\n+/).filter((p: string) => p.trim())

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <main style={{ maxWidth: 760, margin: '0 auto', padding: 16 }}>
        <nav style={{ fontSize: 12, color: colors.textMuted, marginBottom: 16 }}>
          <a href="/" style={{ color: colors.textSecondary, textDecoration: 'none' }}>Home</a> › <a href="/blog" style={{ color: colors.textSecondary, textDecoration: 'none' }}>Guides</a>
        </nav>
        <span style={{ background: colors.accent + '20', color: colors.accent, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{post.category}</span>
        <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900, color: colors.textPrimary, margin: '14px 0 8px', lineHeight: 1.3 }}>{post.title}</h1>
        <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 20 }}>{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <AdBanner position="job_detail_top" />

        <div style={{ marginTop: 20, color: colors.textSecondary, fontSize: 15, lineHeight: 1.9 }}>
          {paragraphs.map((p: string, i: number) => (
            <p key={i} style={{ marginBottom: 18 }}>{p}</p>
          ))}
        </div>

        <AdBanner position="job_detail_bottom" />

        <div style={{ textAlign: 'center', marginTop: 24, padding: 20, background: colors.cardBg, borderRadius: 12, border: `1px solid ${colors.cardBorder}` }}>
          <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 12 }}>Latest sarkari naukri updates ke liye jobs page check karein</p>
          <a href="/jobs" style={{ display: 'inline-block', padding: '10px 28px', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, borderRadius: 8, color: '#000', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Sarkari Jobs Dekho →</a>
        </div>
      </main>
    </div>
  )
}
