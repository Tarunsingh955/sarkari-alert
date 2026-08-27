'use client'
import { useTheme } from './ThemeProvider'
import AdBanner from './AdBanner'

export default function NewsPageClient({ items, total }: { items: any[]; total: number }) {
  const { colors } = useTheme()
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: colors.textPrimary, marginBottom: 4 }}>Sarkari Naukri News</h1>
          <p style={{ color: colors.textMuted, fontSize: 13 }}>Latest government updates aur announcements | {total} News</p>
        </div>
        <AdBanner position="header" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {items.map((item: any, i: number) => (
            <div key={item.id}>
              {i === 5 && <AdBanner position="between_jobs" height={60} />}
              <a href={`/news/${item.slug}`} style={{ display: 'block', background: colors.cardBg, borderRadius: 10, padding: '16px 18px', border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}`, textDecoration: 'none' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  {item.is_urgent && <span style={{ background: '#ef444420', color: '#ef4444', fontSize: 10, padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>URGENT</span>}
                  {item.category && <span style={{ background: colors.accent+'20', color: colors.accent, fontSize: 10, padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>{item.category}</span>}
                  <span style={{ color: colors.textMuted, fontSize: 11 }}>{new Date(item.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                <h2 style={{ color: colors.textPrimary, fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.5 }}>{item.title}</h2>
                {item.excerpt && <p style={{ color: colors.textSecondary, fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>{item.excerpt}</p>}
              </a>
            </div>
          ))}
        </div>

        {!items.length && (
          <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📰</div>
            <p style={{ fontSize: 16 }}>Abhi koi news available nahi hai.</p>
          </div>
        )}

        <AdBanner position="footer" />
      </main>
    </div>
  )
}
