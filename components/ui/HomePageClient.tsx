'use client'
import { useTheme } from './ThemeProvider'
import AdBanner from './AdBanner'
import JobCard from './JobCard'

export default function HomePageClient({ jobs, news, hotJobs }: { jobs: any[]; news: any[]; hotJobs: any[] }) {
  const { colors } = useTheme()

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary, fontFamily: 'inherit' }}>
      <main>
        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg,${colors.cardBg},${colors.bg})`, padding: '32px 16px', borderBottom: `1px solid ${colors.cardBorder}`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%,#1e40af15,transparent 50%),radial-gradient(circle at 80% 50%,#f59e0b10,transparent 50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', color: colors.accent, marginBottom: 10, fontWeight: 700 }}>INDIA'S MOST TRUSTED GOVT JOB PORTAL</div>
            <h1 style={{ fontSize: 'clamp(22px,5vw,42px)', fontWeight: 900, color: colors.textPrimary, marginBottom: 10, lineHeight: 1.2 }}>Sarkari Naukri ke saath<br /><span style={{ color: colors.accent }}>Apna Career Banao!</span></h1>
            <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 22 }}>Latest Govt Jobs • Current Affairs • Free Resume Builder • Previous Papers</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              <a href="/jobs" style={{ background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, border: 'none', borderRadius: 10, padding: '12px 24px', color: '#000', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>Jobs Dekho</a>
              <a href="/resume" style={{ background: 'transparent', border: `2px solid ${colors.accent}`, borderRadius: 10, padding: '12px 24px', color: colors.accent, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Free Resume</a>
              <a href="/previous-papers" style={{ background: 'transparent', border: '2px solid #3b82f6', borderRadius: 10, padding: '12px 24px', color: '#3b82f6', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Previous Papers</a>
            </div>
            <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['1.2L+', 'Active Jobs'], ['50K+', 'Daily Visitors'], ['100%', 'Free Content'], ['24/7', 'Updates']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 900, color: colors.accent }}>{n}</div><div style={{ fontSize: 11, color: colors.textMuted }}>{l}</div></div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
          <AdBanner position="header" />

          {/* Category Quick Links */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            {[['🏛️', 'Central', 'central', '#f59e0b'], ['🚂', 'Railway', 'railway', '#3b82f6'], ['🏦', 'Banking', 'banking', '#8b5cf6'], ['⚔️', 'Defence', 'defence', '#ef4444'], ['📚', 'Teaching', 'teaching', '#ec4899'], ['📋', 'SSC', 'ssc', '#f97316'], ['🎯', 'UPSC', 'upsc', '#06b6d4']].map(([icon, label, slug, catColor]) => (
              <a key={slug} href={`/jobs?category=${slug}`} style={{ background: colors.cardBg, border: `1px solid ${catColor}40`, borderLeft: `3px solid ${catColor}`, borderRadius: 10, padding: '8px 14px 8px 12px', color: colors.textSecondary, fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>{icon} {label}</a>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }} className="home-grid">
            <div>
              {/* Hot Jobs */}
              {hotJobs.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary, margin: 0 }}>🔥 Hot Jobs</h2>
                    <a href="/jobs?sort=popular" style={{ background: 'none', border: `1px solid ${colors.cardBorder}`, borderRadius: 6, padding: '4px 12px', color: colors.textSecondary, fontSize: 12, textDecoration: 'none' }}>Sab Dekho →</a>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {hotJobs.map(job => <JobCard key={job.id} job={job} />)}
                  </div>
                </section>
              )}
              <AdBanner position="between_jobs" height={60} />
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary, margin: 0 }}>📋 Latest Sarkari Jobs</h2>
                  <a href="/jobs" style={{ background: 'none', border: `1px solid ${colors.cardBorder}`, borderRadius: 6, padding: '4px 12px', color: colors.textSecondary, fontSize: 12, textDecoration: 'none' }}>All Jobs →</a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {jobs.map(job => <JobCard key={job.id} job={job} />)}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside>
              <div style={{ background: colors.cardBg, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 4px ${colors.cardShadow}` }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', marginBottom: 12 }}>🔴 Breaking News</h3>
                {news.slice(0, 6).map(n => (
                  <a key={n.id} href={n.external_link || `/news/${n.slug}`} target={n.external_link ? '_blank' : '_self'} rel="noreferrer" style={{ display: 'block', padding: '9px 0', borderBottom: `1px solid ${colors.bg}`, textDecoration: 'none' }}>
                    {n.is_urgent && <span style={{ background: '#ef444420', color: '#ef4444', fontSize: 9, padding: '1px 6px', borderRadius: 4, fontWeight: 700, marginRight: 6 }}>URGENT</span>}
                    <p style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.4, margin: '4px 0 2px' }}>{n.title}</p>
                    <span style={{ fontSize: 10, color: colors.textMuted }}>{new Date(n.created_at).toLocaleDateString('en-IN')}</span>
                  </a>
                ))}
                <a href="/news" style={{ display: 'block', marginTop: 10, textAlign: 'center', background: 'none', border: `1px solid ${colors.cardBorder}`, borderRadius: 6, padding: '7px', color: colors.textSecondary, fontSize: 12, textDecoration: 'none' }}>Sab News →</a>
              </div>
              <AdBanner position="sidebar_top" height={250} />
              <div style={{ background: colors.cardBg, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 4px ${colors.cardShadow}` }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: colors.textPrimary, marginBottom: 12 }}>⚡ Quick Links</h3>
                {[['🪪', 'Admit Card', '/admit-card'], ['📊', 'Result', '/result'], ['🗝️', 'Answer Key', '/answer-key'], ['📖', 'Previous Papers', '/previous-papers'], ['📅', 'Exam Calendar', '/exam-calendar'], ['📄', 'Free Resume', '/resume'], ['📰', 'Current Affairs', '/current-affairs']].map(([icon, label, href]) => (
                  <a key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${colors.bg}`, color: colors.textSecondary, fontSize: 13, textDecoration: 'none' }}>
                    <span>{icon}</span><span style={{ flex: 1 }}>{label}</span><span style={{ color: colors.textMuted }}>›</span>
                  </a>
                ))}
              </div>
              {/* Premium CTA */}
              <div style={{ background: `linear-gradient(135deg,${colors.cardBg},${colors.bg})`, border: `1px solid ${colors.accent}40`, borderRadius: 12, padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: colors.accent, marginBottom: 8 }}>⭐ Premium Membership</h3>
                <p style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>Ad-free experience, premium resume templates, faster notifications</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/membership" style={{ flex: 1, textAlign: 'center', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, borderRadius: 8, padding: '8px', color: '#000', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>Rs.49/mo</a>
                  <a href="/membership" style={{ flex: 1, textAlign: 'center', background: '#1e40af22', border: '1px solid #1e40af44', borderRadius: 8, padding: '8px', color: '#60a5fa', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>Rs.199/yr</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <style>{`@media(max-width:768px){.home-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}
