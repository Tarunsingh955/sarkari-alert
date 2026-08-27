'use client'
import { useTheme } from './ThemeProvider'
import AdBanner from './AdBanner'

const CATS = ['SSC','Railway','Banking','UPSC','Defence','Teaching','State','PSC']
const YEARS = [2024,2023,2022,2021,2020,2019,2018]

export default function PreviousPapersPageClient({ papers, total, sp }: { papers: any[]; total: number; sp: any }) {
  const { colors } = useTheme()
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: colors.textPrimary, marginBottom: 4 }}>Previous Year Papers</h1>
          <p style={{ color: colors.textMuted, fontSize: 13 }}>Free PDF Download — SSC, Railway, UPSC, Banking, State Exams</p>
        </div>
        <AdBanner position="header" />
        <div style={{ background: colors.cardBg, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
          <form method="GET" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input name="search" defaultValue={sp.search || ''} placeholder="Search papers..." style={{ width: '100%', padding: '10px 14px', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.textPrimary, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: colors.textMuted, alignSelf: 'center' }}>Exam:</span>
              <a href="/previous-papers" style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, background: !sp.category ? colors.accent : colors.inputBg, border: `1px solid ${!sp.category ? colors.accent : colors.cardBorder}`, color: !sp.category ? '#000' : colors.textSecondary, textDecoration: 'none' }}>Sab</a>
              {CATS.map(c => <a key={c} href={`/previous-papers?category=${c}`} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, background: sp.category === c ? colors.accent : colors.inputBg, border: `1px solid ${sp.category === c ? colors.accent : colors.cardBorder}`, color: sp.category === c ? '#000' : colors.textSecondary, textDecoration: 'none' }}>{c}</a>)}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: colors.textMuted, alignSelf: 'center' }}>Year:</span>
              <a href="/previous-papers" style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, background: !sp.year ? '#8b5cf6' : colors.inputBg, border: `1px solid ${!sp.year ? '#8b5cf6' : colors.cardBorder}`, color: !sp.year ? '#fff' : colors.textSecondary, textDecoration: 'none' }}>All Years</a>
              {YEARS.map(y => <a key={y} href={`/previous-papers?year=${y}`} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, background: Number(sp.year) === y ? '#8b5cf6' : colors.inputBg, border: `1px solid ${Number(sp.year) === y ? '#8b5cf6' : colors.cardBorder}`, color: Number(sp.year) === y ? '#fff' : colors.textSecondary, textDecoration: 'none' }}>{y}</a>)}
            </div>
            <button type="submit" style={{ alignSelf: 'flex-start', padding: '8px 20px', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 8, color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Search</button>
          </form>
        </div>
        <div style={{ color: colors.textMuted, fontSize: 13, marginBottom: 12 }}>{total} papers available</div>
        {papers.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
            {papers.map((paper: any, i: number) => (
              <div key={paper.id}>
                {i === 6 && <div style={{ gridColumn: '1/-1' }}><AdBanner position="between_jobs" height={60} /></div>}
                <div style={{ background: colors.cardBg, borderRadius: 12, padding: 18, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ background: '#3b82f620', color: '#3b82f6', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{paper.category}</span>
                    {paper.year && <span style={{ background: '#8b5cf620', color: '#8b5cf6', fontSize: 11, padding: '2px 8px', borderRadius: 20 }}>{paper.year}</span>}
                    {paper.is_premium && <span style={{ background: colors.accent+'20', color: colors.accent, fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>PREMIUM</span>}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, marginBottom: 8, lineHeight: 1.4 }}>{paper.title}</h3>
                  {paper.description && <p style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12, lineHeight: 1.5 }}>{paper.description}</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: colors.textMuted }}>{paper.downloads || 0} downloads</span>
                    {paper.pdf_url ? (
                      paper.is_premium ? (
                        <a href="/membership" style={{ background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, borderRadius: 8, padding: '6px 14px', color: '#000', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>Premium PDF</a>
                      ) : (
                        <a href={`/api/papers/download/${paper.id}`} target="_blank" rel="noreferrer" style={{ background: '#10b98122', border: '1px solid #10b98144', borderRadius: 8, padding: '6px 14px', color: '#10b981', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>Download PDF</a>
                      )
                    ) : <span style={{ color: colors.textMuted, fontSize: 12 }}>Coming Soon</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>No Papers</div>
            <p>Koi paper nahi mila. Filter change karein.</p>
            <a href="/previous-papers" style={{ display: 'inline-block', marginTop: 12, padding: '10px 24px', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, borderRadius: 8, color: '#000', fontWeight: 700, textDecoration: 'none' }}>Sab Papers Dekho</a>
          </div>
        )}
      </main>
    </div>
  )
}
