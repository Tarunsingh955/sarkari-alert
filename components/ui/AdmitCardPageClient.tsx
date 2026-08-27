'use client'
import { useTheme } from './ThemeProvider'
import AdBanner from './AdBanner'

export default function AdmitCardPageClient({ items, total, sp }: { items: any[]; total: number; sp: any }) {
  const { colors } = useTheme()
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: colors.textPrimary, marginBottom: 4 }}>Admit Card 2025</h1>
          <p style={{ color: colors.textMuted, fontSize: 13 }}>Latest Sarkari Exam Admit Cards | {total} Available</p>
        </div>
        <AdBanner position="header" />

        <form method="GET" style={{ marginBottom: 16 }}>
          <input name="search" defaultValue={sp.search || ''} placeholder="🔍 Search admit card by exam name..."
            style={{ width: '100%', padding: '12px 16px', background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
          {items.map((item: any, i: number) => (
            <div key={item.id}>
              {i === 6 && <div style={{ gridColumn: '1/-1' }}><AdBanner position="between_jobs" height={60} /></div>}
              <div style={{ background: colors.cardBg, borderRadius: 12, padding: 18, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {item.jobs?.categories && (
                    <span style={{ background: (item.jobs.categories.color || colors.accent) + '22', color: item.jobs.categories.color || colors.accent, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
                      {item.jobs.categories.icon} {item.jobs.categories.name}
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: colors.textPrimary, marginBottom: 8 }}>{item.title}</h2>
                {item.exam_date && <p style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 4 }}>📅 Exam Date: {item.exam_date}</p>}
                {item.release_date && <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 12 }}>Released: {new Date(item.release_date).toLocaleDateString('en-IN')}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  {item.jobs?.slug && (
                    <a href={`/jobs/${item.jobs.slug}`} style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.textSecondary, fontSize: 13, textDecoration: 'none' }}>Job Details</a>
                  )}
                  {item.download_link && (
                    <a href={item.download_link} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, borderRadius: 8, color: '#000', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Download →</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!items.length && (
          <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎫</div>
            <p style={{ fontSize: 16, marginBottom: 8 }}>Abhi koi Admit Card available nahi hai.</p>
            <a href="/jobs" style={{ padding: '10px 24px', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 8, color: '#000', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>Sab Jobs Dekho</a>
          </div>
        )}

        <AdBanner position="footer" />
      </main>
    </div>
  )
}
