// app/jobs/[slug]/page.tsx
// NOTE: Rename folder from 'slug' to '[slug]' after download
import { supabaseAdmin } from '@/lib/supabase'
import { generateJobMeta, generateJobSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdBanner from '@/components/ui/AdBanner'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateStaticParams() {
  const { data } = await supabaseAdmin.from('jobs').select('slug').eq('is_published', true).limit(200)
  return (data || []).map(j => ({ slug: j.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: job } = await supabaseAdmin.from('jobs').select('*').eq('slug', params.slug).single()
  if (!job) return { title: 'Job Not Found' }
  const meta = generateJobMeta(job)
  return { title: meta.title, description: meta.description, keywords: meta.keywords, alternates: { canonical: `/jobs/${job.slug}` }, openGraph: { title: meta.title, description: meta.description, type: 'article' } }
}

function daysLeft(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000) }

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
  const { data: job } = await supabaseAdmin.from('jobs').select('*,categories(name,color,icon,slug),states(name),admit_cards(*),results(*),answer_keys(*),syllabus(*)').eq('slug', params.slug).eq('is_published', true).single()
  if (!job) notFound()

  supabaseAdmin.rpc('increment_job_views', { job_slug: params.slug }).then(() => {})

  const days = daysLeft(job.last_date)
  const urgent = days <= 7 && days > 0
  const catColor = job.categories?.color || '#f59e0b'
  const jobSchema = generateJobSchema(job)
  const faqSchema = generateFAQSchema(job)
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Jobs', url: '/jobs' }, { name: job.title, url: `/jobs/${job.slug}` }])

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
          <a href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</a> › <a href="/jobs" style={{ color: '#94a3b8', textDecoration: 'none' }}>Jobs</a> › <span style={{ color: '#f59e0b' }}>{job.title}</span>
        </nav>
        {/* Header Card */}
        <div style={{ background: '#1e293b', borderRadius: 16, padding: 24, marginBottom: 20, border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={{ background: catColor + '22', color: catColor, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{job.categories?.icon} {job.categories?.name}</span>
                {job.is_new && <span style={{ background: '#10b98120', color: '#10b981', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>NEW</span>}
                {job.is_hot && <span style={{ background: '#ef444420', color: '#ef4444', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>🔥 HOT</span>}
                {job.is_sponsored && <span style={{ background: '#8b5cf620', color: '#8b5cf6', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>SPONSORED</span>}
              </div>
              <h1 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>{job.title}</h1>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>{job.department}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {days > 0 ? <div style={{ color: urgent ? '#ef4444' : '#10b981', fontWeight: 700, fontSize: 18 }}>{days} din bache</div> : <div style={{ color: '#ef4444', fontWeight: 700 }}>CLOSED</div>}
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Last Date: {new Date(job.last_date).toLocaleDateString('en-IN')}</div>
            </div>
          </div>
        </div>
        <AdBanner position="job_detail_top" />
        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 20 }}>
          {[['📋 Total Posts', job.total_posts || 'N/A'], ['💰 Salary', job.salary_text || 'As per rules'], ['🎓 Qualification', job.qualification || 'N/A'], ['🎂 Age Limit', job.age_text || 'N/A'], ['📍 State', job.states?.name || 'All India'], ['📝 Exam Date', job.exam_date || 'TBA']].map(([k, v]) => (
            <div key={k} style={{ background: '#1e293b', borderRadius: 10, padding: '14px 16px', border: '1px solid #334155' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{v}</div>
            </div>
          ))}
        </div>
        {/* Important Links */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid #334155' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', marginBottom: 16 }}>🔗 Important Links</h2>
          {[
            job.notification_pdf && { label: 'Official Notification PDF', href: job.notification_pdf, text: 'Download PDF', color: '#3b82f6' },
            job.apply_link && { label: 'Online Application', href: job.apply_link, text: 'Apply Now →', color: '#f59e0b', dark: true },
            job.official_website && { label: 'Official Website', href: job.official_website, text: 'Visit →', color: '#10b981' },
            job.admit_cards?.[0] && { label: 'Admit Card', href: `/jobs/${job.slug}/admit-card`, text: 'Download →', color: '#8b5cf6' },
            job.results?.[0] && { label: 'Result', href: `/jobs/${job.slug}/result`, text: 'Check →', color: '#10b981' },
            job.answer_keys?.[0] && { label: 'Answer Key', href: `/jobs/${job.slug}/answer-key`, text: 'Download →', color: '#ec4899' },
          ].filter(Boolean).map((link: any, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #0f172a', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ color: '#cbd5e1', fontSize: 14 }}>{link.label}</span>
              <a href={link.href} target={link.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                style={{ background: link.dark ? 'linear-gradient(135deg,#f59e0b,#d97706)' : link.color + '22', border: `1px solid ${link.color}44`, borderRadius: 8, padding: '7px 18px', color: link.dark ? '#000' : link.color, fontWeight: 700, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
                {link.text}
              </a>
            </div>
          ))}
        </div>
        {/* Selection Process */}
        {job.selection_process && (
          <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid #334155' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', marginBottom: 12 }}>📋 Selection Process</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {job.selection_process.split('→').map((s: string, i: number) => (
                <span key={i} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 20, padding: '5px 14px', fontSize: 13, color: '#cbd5e1' }}>{i + 1}. {s.trim()}</span>
              ))}
            </div>
          </div>
        )}
        {/* Description */}
        {job.description && (
          <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid #334155' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', marginBottom: 12 }}>📄 Job Details</h2>
            <div style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: 14, whiteSpace: 'pre-wrap' }}>{job.description}</div>
          </div>
        )}
        {/* FAQ Section */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid #334155' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', marginBottom: 16 }}>❓ Frequently Asked Questions</h2>
          {[
            [`${job.title} mein apply kaise karein?`, `${job.official_website || 'Official website'} par jaayein aur Apply Online click karein. Last date ${new Date(job.last_date).toLocaleDateString('en-IN')} hai.`],
            [`${job.title} ki age limit kya hai?`, job.age_text || 'Kripya official notification check karein age limit ke liye.'],
            [`${job.title} ke liye qualification kya chahiye?`, job.qualification || 'Kripya official notification check karein qualification ke liye.'],
            [`${job.title} ka selection process kya hai?`, job.selection_process || 'Written Exam followed by Document Verification.'],
            [`${job.title} mein salary kitni milegi?`, job.salary_text || `Rs.${job.salary_min?.toLocaleString('en-IN')} - Rs.${job.salary_max?.toLocaleString('en-IN')} per month`],
          ].map(([q, a], i) => (
            <details key={i} style={{ marginBottom: 10, background: '#0f172a', borderRadius: 8, padding: '12px 16px', border: '1px solid #334155', cursor: 'pointer' }}>
              <summary style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600, listStyle: 'none', userSelect: 'none' }}>Q: {q}</summary>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: '10px 0 0' }}>A: {a}</p>
            </details>
          ))}
        </div>
        <AdBanner position="job_detail_bottom" />
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <a href={job.apply_link || job.official_website || '#'} target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', padding: '16px 48px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 12, color: '#000', fontWeight: 800, fontSize: 18, textDecoration: 'none' }}>
            Apply Now — Official Website →
          </a>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 10 }}>Sirf official government website se apply karein</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
