'use client'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function DashboardClient({ adminName, stats, totalRevenue, topJobs }: { adminName: string; stats: any; totalRevenue: number; topJobs: any[] }) {
  const { colors } = useTheme()
  const { jobs, news, users, premium, whatsapp, queue } = stats

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: colors.textPrimary, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: colors.textMuted, fontSize: 13 }}>Welcome back, {adminName}! Here is your overview.</p>
      </div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, marginBottom: 28 }}>
        {[['Total Jobs', jobs, '#f59e0b', '🏛️', '/admin/jobs'], ['Total News', news, '#3b82f6', '📰', '/admin/news'], ['Total Users', users, '#8b5cf6', '👥', '/admin/users'], ['Premium Members', premium, '#10b981', '⭐', '/admin/membership'], ['WhatsApp Subs', whatsapp, '#ec4899', '💬', '/admin/whatsapp'], ['Pending Queue', queue, '#ef4444', '⏳', '/admin/queue'], ['Total Revenue', `Rs.${totalRevenue.toLocaleString('en-IN')}`, '#10b981', '💰', '/admin/analytics']].map(([l, v, c, i, href]) => (
          <a key={String(l)} href={href as string} style={{ background: colors.cardBg, borderRadius: 12, padding: 18, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}`, textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{String(i)}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: String(c), marginBottom: 4 }}>{String(v)}</div>
            <div style={{ fontSize: 11, color: colors.textMuted }}>{String(l)}</div>
          </a>
        ))}
      </div>
      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: colors.cardBg, borderRadius: 14, padding: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
          <h3 style={{ color: colors.accent, fontSize: 15, fontWeight: 800, marginBottom: 16 }}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['➕ Add New Job', '/admin/jobs'], ['📰 Add News', '/admin/news'], ['📄 Add Paper', '/admin/papers'], ['⏳ Review Queue', '/admin/queue'], ['💬 WhatsApp Broadcast', '/admin/whatsapp'], ['🤖 Run Automation', '/api/automation']].map(([l, h]) => (
              <a key={String(l)} href={String(h)} style={{ display: 'block', padding: '10px 14px', background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 8, color: colors.textSecondary, fontSize: 13, textDecoration: 'none' }}>
                {String(l)}
              </a>
            ))}
          </div>
        </div>
        <div style={{ background: colors.cardBg, borderRadius: 14, padding: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
          <h3 style={{ color: colors.accent, fontSize: 15, fontWeight: 800, marginBottom: 16 }}>🏆 Top Jobs by Views</h3>
          {topJobs.map((job: any, i: number) => (
            <div key={job.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${colors.bg}` }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, minWidth: 0 }}>
                <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 700, width: 20 }}>#{i + 1}</span>
                <a href={`/jobs/${job.slug}`} target="_blank" style={{ color: colors.textPrimary, fontSize: 12, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</a>
              </div>
              <span style={{ color: colors.accent, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{(job.views || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div style={{ background: colors.cardBg, borderRadius: 14, padding: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: `0 1px 3px ${colors.cardShadow}` }}>
        <h3 style={{ color: colors.accent, fontSize: 15, fontWeight: 800, marginBottom: 16 }}>🔗 Navigation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
          {[['Jobs Management', '/admin/jobs', '#f59e0b'], ['News Management', '/admin/news', '#3b82f6'], ['Review Queue', '/admin/queue', '#ef4444'], ['Previous Papers', '/admin/papers', '#10b981'], ['WhatsApp Subscribers', '/admin/whatsapp', '#ec4899'], ['User Management', '/admin/users', '#8b5cf6'], ['Analytics', '/admin/analytics', '#06b6d4'], ['Sources', '/admin/sources', '#84cc16']].map(([l, h, c]) => (
            <a key={String(l)} href={String(h)} style={{ background: colors.inputBg, border: `1px solid ${String(c)}33`, borderRadius: 10, padding: '14px 16px', color: String(c), fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'block', textAlign: 'center' }}>{String(l)}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
