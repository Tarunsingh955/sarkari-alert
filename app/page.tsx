import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdBanner from '@/components/ui/AdBanner'
import JobCard from '@/components/ui/JobCard'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'SarkariAlert — India #1 Govt Job Portal 2025',
  description: 'Latest Sarkari Naukri 2025. SSC, Railway, UPSC, Banking, State Jobs. Free Resume Builder, Current Affairs, Admit Card.',
}

async function getData() {
  const [{ data: jobs }, { data: news }, { data: hotJobs }] = await Promise.all([
    supabaseAdmin.from('jobs').select('*,categories(name,color,icon,slug),states(name)').eq('is_published', true).eq('is_active', true).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('news').select('*').eq('is_published', true).eq('is_active', true).order('created_at', { ascending: false }).limit(8),
    supabaseAdmin.from('jobs').select('*,categories(name,color,icon,slug),states(name)').eq('is_published', true).eq('is_active', true).eq('is_hot', true).order('views', { ascending: false }).limit(5),
  ])
  return { jobs: jobs || [], news: news || [], hotJobs: hotJobs || [] }
}

export default async function HomePage() {
  const { jobs, news, hotJobs } = await getData()
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', fontFamily: 'inherit' }}>
      <Header />
      <main>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0f172a)', padding: '32px 16px', borderBottom: '1px solid #1e40af40', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%,#1e40af15,transparent 50%),radial-gradient(circle at 80% 50%,#f59e0b10,transparent 50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#f59e0b', marginBottom: 10, fontWeight: 700 }}>INDIA'S MOST TRUSTED GOVT JOB PORTAL</div>
            <h1 style={{ fontSize: 'clamp(22px,5vw,42px)', fontWeight: 900, color: '#fff', marginBottom: 10, lineHeight: 1.2 }}>Sarkari Naukri ke saath<br /><span style={{ color: '#f59e0b' }}>Apna Career Banao!</span></h1>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 22 }}>Latest Govt Jobs • Current Affairs • Free Resume Builder • Previous Papers</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              <a href="/jobs" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 10, padding: '12px 24px', color: '#000', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>Jobs Dekho</a>
              <a href="/resume" style={{ background: 'transparent', border: '2px solid #f59e0b', borderRadius: 10, padding: '12px 24px', color: '#f59e0b', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Free Resume</a>
              <a href="/previous-papers" style={{ background: 'transparent', border: '2px solid #3b82f6', borderRadius: 10, padding: '12px 24px', color: '#3b82f6', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Previous Papers</a>
            </div>
            <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['1.2L+', 'Active Jobs'], ['50K+', 'Daily Visitors'], ['100%', 'Free Content'], ['24/7', 'Updates']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b' }}>{n}</div><div style={{ fontSize: 11, color: '#64748b' }}>{l}</div></div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
          <AdBanner position="header" />

          {/* Category Quick Links */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            {[['🏛️', 'Central', 'central'], ['🚂', 'Railway', 'railway'], ['🏦', 'Banking', 'banking'], ['⚔️', 'Defence', 'defence'], ['📚', 'Teaching', 'teaching'], ['📋', 'SSC', 'ssc'], ['🎯', 'UPSC', 'upsc']].map(([icon, label, slug]) => (
              <a key={slug} href={`/jobs?category=${slug}`} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '8px 14px', color: '#94a3b8', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>{icon} {label}</a>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }} className="home-grid">
            <div>
              {/* Hot Jobs */}
              {hotJobs.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>🔥 Hot Jobs</h2>
                    <a href="/jobs?sort=popular" style={{ background: 'none', border: '1px solid #334155', borderRadius: 6, padding: '4px 12px', color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>Sab Dekho →</a>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {hotJobs.map(job => <JobCard key={job.id} job={job} />)}
                  </div>
                </section>
              )}
              <AdBanner position="between_jobs" height={60} />
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>📋 Latest Sarkari Jobs</h2>
                  <a href="/jobs" style={{ background: 'none', border: '1px solid #334155', borderRadius: 6, padding: '4px 12px', color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>All Jobs →</a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {jobs.map(job => <JobCard key={job.id} job={job} />)}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside>
              <div style={{ background: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid #334155' }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', marginBottom: 12 }}>🔴 Breaking News</h3>
                {news.slice(0, 6).map(n => (
                  <a key={n.id} href={n.external_link || `/news/${n.slug}`} target={n.external_link ? '_blank' : '_self'} rel="noreferrer" style={{ display: 'block', padding: '9px 0', borderBottom: '1px solid #0f172a', textDecoration: 'none' }}>
                    {n.is_urgent && <span style={{ background: '#ef444420', color: '#ef4444', fontSize: 9, padding: '1px 6px', borderRadius: 4, fontWeight: 700, marginRight: 6 }}>URGENT</span>}
                    <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.4, margin: '4px 0 2px' }}>{n.title}</p>
                    <span style={{ fontSize: 10, color: '#475569' }}>{new Date(n.created_at).toLocaleDateString('en-IN')}</span>
                  </a>
                ))}
                <a href="/news" style={{ display: 'block', marginTop: 10, textAlign: 'center', background: 'none', border: '1px solid #334155', borderRadius: 6, padding: '7px', color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>Sab News →</a>
              </div>
              <AdBanner position="sidebar_top" height={250} />
              <div style={{ background: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid #334155' }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>⚡ Quick Links</h3>
                {[['🪪', 'Admit Card', '/admit-card'], ['📊', 'Result', '/result'], ['🗝️', 'Answer Key', '/answer-key'], ['📖', 'Previous Papers', '/previous-papers'], ['📅', 'Exam Calendar', '/exam-calendar'], ['📄', 'Free Resume', '/resume'], ['📰', 'Current Affairs', '/current-affairs']].map(([icon, label, href]) => (
                  <a key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #0f172a', color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>
                    <span>{icon}</span><span style={{ flex: 1 }}>{label}</span><span style={{ color: '#475569' }}>›</span>
                  </a>
                ))}
              </div>
              {/* Premium CTA */}
              <div style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', border: '1px solid #f59e0b40', borderRadius: 12, padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f59e0b', marginBottom: 8 }}>⭐ Premium Membership</h3>
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, lineHeight: 1.6 }}>Ad-free experience, premium resume templates, faster notifications</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="/membership" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 8, padding: '8px', color: '#000', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>Rs.49/mo</a>
                  <a href="/membership" style={{ flex: 1, textAlign: 'center', background: '#1e40af22', border: '1px solid #1e40af44', borderRadius: 8, padding: '8px', color: '#60a5fa', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>Rs.199/yr</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`@media(max-width:768px){.home-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}
