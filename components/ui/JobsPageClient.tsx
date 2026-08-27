'use client'
import { useTheme } from './ThemeProvider'
import AdBanner from './AdBanner'
import JobCard from './JobCard'

const CATEGORIES = ['Central','State','Railway','Banking','Teaching','Defence','SSC','UPSC','PSC']
const STATES = ['Uttar Pradesh','Bihar','Rajasthan','Madhya Pradesh','Maharashtra','Delhi','Haryana','Punjab','Gujarat','Karnataka','Tamil Nadu','West Bengal','Uttarakhand','Himachal Pradesh']

export default function JobsPageClient({ jobs, total, page, pages, sp }: { jobs: any[]; total: number; page: number; pages: number; sp: any }) {
  const { colors } = useTheme()

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: colors.textPrimary, marginBottom: 4 }}>Sarkari Jobs 2025</h1>
          <p style={{ color: colors.textMuted, fontSize: 13 }}>Latest Government Jobs — Updated Daily | {total} Jobs Available</p>
        </div>
        <AdBanner position="header" />
        {/* Filters */}
        <div style={{ background: colors.cardBg, borderRadius: 12, padding: 16, marginBottom: 14, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
          <form method="GET" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input name="search" defaultValue={sp.search || ''} placeholder="Search — SSC, Railway, Police, Bank, Teacher..." style={{ width: '100%', padding: '12px 16px', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: colors.textMuted, alignSelf: 'center' }}>Category:</span>
              <a href="/jobs" style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: !sp.category ? colors.accent : colors.inputBg, border: `1px solid ${!sp.category ? colors.accent : colors.cardBorder}`, color: !sp.category ? '#000' : colors.textSecondary, textDecoration: 'none', fontWeight: !sp.category ? 700 : 400 }}>Sab</a>
              {CATEGORIES.map(c => <a key={c} href={`/jobs?category=${c.toLowerCase()}`} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: sp.category === c.toLowerCase() ? colors.accent : colors.inputBg, border: `1px solid ${sp.category === c.toLowerCase() ? colors.accent : colors.cardBorder}`, color: sp.category === c.toLowerCase() ? '#000' : colors.textSecondary, textDecoration: 'none', fontWeight: sp.category === c.toLowerCase() ? 700 : 400 }}>{c}</a>)}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: colors.textMuted, alignSelf: 'center' }}>State:</span>
              {STATES.map(s => <a key={s} href={`/jobs?state=${encodeURIComponent(s)}`} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: sp.state === s ? '#10b981' : colors.inputBg, border: `1px solid ${sp.state === s ? '#10b981' : colors.cardBorder}`, color: sp.state === s ? '#000' : colors.textSecondary, textDecoration: 'none', fontWeight: sp.state === s ? 700 : 400 }}>{s}</a>)}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: colors.textMuted }}>Sort:</span>
              {[['newest','Newest'],['deadline','Last Date'],['popular','Popular']].map(([v,l]) => <a key={v} href={`/jobs?sort=${v}`} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: (sp.sort||'newest')===v ? '#8b5cf6' : colors.inputBg, border: `1px solid ${(sp.sort||'newest')===v ? '#8b5cf6' : colors.cardBorder}`, color: (sp.sort||'newest')===v ? '#fff' : colors.textSecondary, textDecoration: 'none' }}>{l}</a>)}
              <button type="submit" style={{ padding: '5px 16px', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 20, color: '#000', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Search</button>
            </div>
          </form>
        </div>
        {(sp.category || sp.state || sp.search) && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: colors.textMuted }}>Active:</span>
            {sp.category && <span style={{ background: colors.accent+'20', color: colors.accent, fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>Category: {sp.category}</span>}
            {sp.state && <span style={{ background: '#10b98120', color: '#10b981', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>State: {sp.state}</span>}
            {sp.search && <span style={{ background: '#8b5cf620', color: '#8b5cf6', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>Search: "{sp.search}"</span>}
            <a href="/jobs" style={{ color: '#ef4444', fontSize: 12, textDecoration: 'none' }}>✕ Clear</a>
          </div>
        )}
        <div style={{ color: colors.textMuted, fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{total} jobs mile</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 12 }}>
          {jobs.map((job, i) => (
            <div key={job.id}>
              {i === 6 && <div style={{ gridColumn: '1/-1' }}><AdBanner position="between_jobs" height={60} /></div>}
              <JobCard job={job} />
            </div>
          ))}
        </div>
        {!jobs.length && (
          <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>No Jobs</div>
            <p style={{ fontSize: 16, marginBottom: 8 }}>Koi job nahi mila!</p>
            <a href="/jobs" style={{ padding: '10px 24px', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 8, color: '#000', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>Sab Jobs Dekho</a>
          </div>
        )}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <a key={p} href={`/jobs?page=${p}`} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, background: page === p ? colors.accent : colors.cardBg, border: `1px solid ${page === p ? colors.accent : colors.cardBorder}`, color: page === p ? '#000' : colors.textSecondary, fontWeight: page === p ? 700 : 400, textDecoration: 'none' }}>{p}</a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
