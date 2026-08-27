'use client'
import { useTheme } from './ThemeProvider'
import AdBanner from './AdBanner'

export default function ResultPageClient({ results, total, sp }: { results: any[]; total: number; sp: any }) {
  const { colors } = useTheme()
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: colors.textPrimary, marginBottom: 4 }}>Sarkari Result</h1>
          <p style={{ color: colors.textMuted, fontSize: 13 }}>Latest Govt Job Results — SSC, Railway, UPSC, Banking</p>
        </div>
        <AdBanner position="header" />
        <div style={{ background: colors.cardBg, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
          <form method="GET">
            <input name="search" defaultValue={sp.search || ''} placeholder="Search results..." style={{ width: '100%', padding: '10px 14px', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.textPrimary, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </form>
        </div>
        <div style={{ color: colors.textMuted, fontSize: 13, marginBottom: 12 }}>{total} results available</div>
        {results.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map((r: any, i: number) => (
              <div key={r.id}>
                {i === 6 && <AdBanner position="between_jobs" height={60} />}
                <div style={{ background: colors.cardBg, borderRadius: 12, padding: 18, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, marginBottom: 6 }}>{r.title}</h3>
                    {r.release_date && <span style={{ fontSize: 12, color: colors.textMuted }}>Released: {r.release_date}</span>}
                    {r.details && <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 6, lineHeight: 1.5 }}>{r.details}</p>}
                  </div>
                  {r.download_link ? (
                    <a href={r.download_link} target="_blank" rel="noreferrer" style={{ background: '#10b98122', border: '1px solid #10b98144', borderRadius: 8, padding: '8px 16px', color: '#10b981', fontWeight: 700, fontSize: 12, textDecoration: 'none', flexShrink: 0 }}>Check Result</a>
                  ) : <span style={{ color: colors.textMuted, fontSize: 12, flexShrink: 0 }}>Coming Soon</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>No Results</div>
            <p>Abhi koi result nahi mila.</p>
          </div>
        )}
      </main>
    </div>
  )
}
