'use client'
import { useTheme } from './ThemeProvider'
import AdBanner from './AdBanner'

export default function ResumePageClient({ templates }: { templates: any[] }) {
  const { colors } = useTheme()
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: colors.textPrimary, marginBottom: 8 }}>📄 Free Resume Builder</h1>
          <p style={{ color: colors.textSecondary, fontSize: 14 }}>Sarkari naukri ke liye professional resume banao — 2 minute mein!</p>
        </div>
        <AdBanner position="header" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginTop: 20 }}>
          {templates.map((t: any) => (
            <div key={t.id} style={{ background: colors.cardBg, borderRadius: 14, padding: 18, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}`, textAlign: 'center' }}>
              <div style={{ width: '100%', height: 140, background: colors.inputBg, borderRadius: 10, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                📄
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: colors.textPrimary, marginBottom: 6 }}>{t.name}</h3>
              {t.is_free ? (
                <span style={{ background: '#10b98120', color: '#10b981', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>FREE</span>
              ) : (
                <span style={{ background: colors.accent+'20', color: colors.accent, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>₹{t.price}</span>
              )}
              <div style={{ marginTop: 14 }}>
                <a href={`/resume/build?template=${t.id}`} style={{ display: 'block', padding: '10px 0', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, borderRadius: 8, color: '#000', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                  Use Template →
                </a>
              </div>
            </div>
          ))}
        </div>

        {!templates.length && (
          <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
            <p style={{ fontSize: 16 }}>Resume templates jaldi hi available honge!</p>
          </div>
        )}

        <AdBanner position="footer" />
      </main>
    </div>
  )
}
