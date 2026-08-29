'use client'
import { useTheme } from './ThemeProvider'
import AdBanner from './AdBanner'

const NON_OFFICIAL_LINK_MARKERS = [
  'employmentnews.gov.in',
  'sarkarinaukrijobalert.com',
  'rojgarsamachar.gov.in',
  'sahisarkarijobs.in',
]

function daysLeft(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000) }

export default function JobDetailPageClient({ job }: { job: any }) {
  const { colors } = useTheme()
  const days = daysLeft(job.last_date)
  const hasRealApplyLink = job.apply_link && !NON_OFFICIAL_LINK_MARKERS.some((marker: string) => job.apply_link.includes(marker))
  const urgent = days <= 7 && days > 0
  const catColor = job.categories?.color || colors.accent

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 12, color: colors.textMuted, marginBottom: 16 }}>
          <a href="/" style={{ color: colors.textSecondary, textDecoration: 'none' }}>Home</a> › <a href="/jobs" style={{ color: colors.textSecondary, textDecoration: 'none' }}>Jobs</a> › <span style={{ color: colors.accent }}>{job.title}</span>
        </nav>
        {/* Header Card */}
        <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, marginBottom: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={{ background: catColor + '22', color: catColor, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{job.categories?.icon} {job.categories?.name}</span>
                {job.is_new && <span style={{ background: '#10b98120', color: '#10b981', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>NEW</span>}
                {job.is_hot && <span style={{ background: '#ef444420', color: '#ef4444', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>HOT</span>}
                {job.is_sponsored && <span style={{ background: '#8b5cf620', color: '#8b5cf6', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>SPONSORED</span>}
              </div>
              <h1 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 900, color: colors.textPrimary, marginBottom: 6 }}>{job.title}</h1>
              <p style={{ color: colors.textSecondary, fontSize: 14, margin: 0 }}>{job.department}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {days > 0 ? <div style={{ color: urgent ? '#ef4444' : '#10b981', fontWeight: 700, fontSize: 18 }}>{days} din bache</div> : <div style={{ color: '#ef4444', fontWeight: 700 }}>CLOSED</div>}
              <div style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Last Date: {new Date(job.last_date).toLocaleDateString('en-IN')}</div>
            </div>
          </div>
        </div>
        <AdBanner position="job_detail_top" />
        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 20 }}>
          {[['Total Posts', job.total_posts || 'N/A'], ['Salary', job.salary_text || 'As per rules'], ['Qualification', job.qualification || 'N/A'], ['Age Limit', job.age_text || 'N/A'], ['State', job.states?.name || 'All India'], ['Exam Date', job.exam_date || 'TBA']].map(([k, v]) => (
            <div key={k as string} style={{ background: colors.cardBg, borderRadius: 10, padding: '14px 16px', border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
              <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>{v}</div>
            </div>
          ))}
        </div>
        {/* Important Links */}
        <div style={{ background: colors.cardBg, borderRadius: 12, padding: 20, marginBottom: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: colors.accent, marginBottom: 16 }}>Important Links</h2>
          {[
            job.notification_pdf && { label: 'Official Notification PDF', href: job.notification_pdf, text: 'Download PDF', color: '#3b82f6' },
            job.apply_link && { label: hasRealApplyLink ? 'Online Application' : 'Official Notification', href: job.apply_link, text: hasRealApplyLink ? 'Apply Now →' : 'View Notification →', color: colors.accent, dark: true },
            job.official_website && job.official_website !== job.apply_link && { label: hasRealApplyLink ? 'Official Website' : 'Source', href: job.official_website, text: hasRealApplyLink ? 'Visit →' : 'View →', color: '#10b981' },
            job.admit_cards?.[0] && { label: 'Admit Card', href: `/jobs/${job.slug}/admit-card`, text: 'Download →', color: '#8b5cf6' },
            job.results?.[0] && { label: 'Result', href: `/jobs/${job.slug}/result`, text: 'Check →', color: '#10b981' },
            job.answer_keys?.[0] && { label: 'Answer Key', href: `/jobs/${job.slug}/answer-key`, text: 'Download →', color: '#ec4899' },
          ].filter(Boolean).map((link: any, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.bg}`, gap: 12, flexWrap: 'wrap' }}>
              <span style={{ color: colors.textSecondary, fontSize: 14 }}>{link.label}</span>
              <a href={link.href} target={link.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                style={{ background: link.dark ? `linear-gradient(135deg,${colors.accent},${colors.accentDark})` : link.color + '22', border: `1px solid ${link.color}44`, borderRadius: 8, padding: '7px 18px', color: link.dark ? '#000' : link.color, fontWeight: 700, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
                {link.text}
              </a>
            </div>
          ))}
        </div>
        {/* Selection Process */}
        {job.selection_process && (
          <div style={{ background: colors.cardBg, borderRadius: 12, padding: 20, marginBottom: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: colors.accent, marginBottom: 12 }}>Selection Process</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {job.selection_process.split('→').map((s: string, i: number) => (
                <span key={i} style={{ background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 20, padding: '5px 14px', fontSize: 13, color: colors.textSecondary }}>{i + 1}. {s.trim()}</span>
              ))}
            </div>
          </div>
        )}
        {/* Description */}
        {job.description && (
          <div style={{ background: colors.cardBg, borderRadius: 12, padding: 20, marginBottom: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: colors.accent, marginBottom: 12 }}>Job Details</h2>
            <div style={{ color: colors.textSecondary, lineHeight: 1.8, fontSize: 14, whiteSpace: 'pre-wrap' }}>{job.description}</div>
          </div>
        )}
        {/* FAQ Section */}
        <div style={{ background: colors.cardBg, borderRadius: 12, padding: 20, marginBottom: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: colors.accent, marginBottom: 16 }}>Frequently Asked Questions</h2>
          {[
            [`${job.title} mein apply kaise karein?`, `${job.official_website || 'Official website'} par jaayein aur Apply Online click karein. Last date ${new Date(job.last_date).toLocaleDateString('en-IN')} hai.`],
            [`${job.title} ki age limit kya hai?`, job.age_text || 'Kripya official notification check karein age limit ke liye.'],
            [`${job.title} ke liye qualification kya chahiye?`, job.qualification || 'Kripya official notification check karein qualification ke liye.'],
            [`${job.title} ka selection process kya hai?`, job.selection_process || 'Written Exam followed by Document Verification.'],
            [`${job.title} mein salary kitni milegi?`, job.salary_text || `Rs.${job.salary_min?.toLocaleString('en-IN')} - Rs.${job.salary_max?.toLocaleString('en-IN')} per month`],
          ].map(([q, a], i) => (
            <details key={i} style={{ marginBottom: 10, background: colors.inputBg, borderRadius: 8, padding: '12px 16px', border: `1px solid ${colors.cardBorder}`, cursor: 'pointer' }}>
              <summary style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600, listStyle: 'none', userSelect: 'none' }}>Q: {q}</summary>
              <p style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 1.7, margin: '10px 0 0' }}>A: {a}</p>
            </details>
          ))}
        </div>
        <AdBanner position="job_detail_bottom" />
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <a href={job.apply_link || job.official_website || '#'} target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', padding: '16px 48px', background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`, borderRadius: 12, color: '#000', fontWeight: 800, fontSize: 18, textDecoration: 'none' }}>
            {hasRealApplyLink ? 'Apply Now — Official Website →' : 'View Full Notification →'}
          </a>
          <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 10 }}>{hasRealApplyLink ? 'Sirf official government website se apply karein' : 'Direct official link abhi available nahi hai — poori notification padhkar khud official website dhoondh kar apply karein'}</p>
        </div>
      </main>
    </div>
  )
}
