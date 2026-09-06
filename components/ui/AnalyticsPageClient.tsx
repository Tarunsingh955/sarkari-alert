'use client'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function AnalyticsPageClient({ recentPayments, topJobs, recentUsers, todayViews, monthViews, totalRev, resumeRev, premRev, totalPayments }: {
  recentPayments: any[]; topJobs: any[]; recentUsers: any[]; todayViews: number; monthViews: number; totalRev: number; resumeRev: number; premRev: number; totalPayments: number
}) {
  const { colors } = useTheme()
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: colors.textPrimary, marginBottom: 20 }}>📈 Analytics</h1>
      {/* Revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
        {[['Total Revenue', `Rs.${totalRev.toLocaleString('en-IN')}`, '#10b981'], ['Resume Sales', `Rs.${resumeRev.toLocaleString('en-IN')}`, colors.accent], ['Premium Revenue', `Rs.${premRev.toLocaleString('en-IN')}`, '#8b5cf6'], ['Today Views', todayViews.toLocaleString(), '#3b82f6'], ['Monthly Views', monthViews.toLocaleString(), '#ec4899'], ['Total Payments', totalPayments, '#06b6d4']].map(([l, v, c]) => (
          <div key={String(l)} style={{ background: colors.cardBg, borderRadius: 12, padding: 18, border: `1px solid ${colors.cardBorder}` }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: String(c) }}>{String(v)}</div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{String(l)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Top Jobs */}
        <div style={{ background: colors.cardBg, borderRadius: 12, padding: 20, border: `1px solid ${colors.cardBorder}` }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: colors.accent, marginBottom: 16 }}>🏆 Top Jobs by Views</h2>
          {topJobs.map((job: any, i: number) => (
            <div key={job.slug} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${colors.bg}`, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, minWidth: 0 }}>
                <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 700, width: 22 }}>#{i + 1}</span>
                <a href={`/jobs/${job.slug}`} target="_blank" style={{ color: colors.textPrimary, fontSize: 13, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</a>
              </div>
              <span style={{ color: colors.accent, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{(job.views || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
        {/* Revenue breakdown */}
        <div style={{ background: colors.cardBg, borderRadius: 12, padding: 20, border: `1px solid ${colors.cardBorder}` }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#10b981', marginBottom: 16 }}>💰 Recent Payments</h2>
          {recentPayments.map((p: any) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${colors.bg}`, alignItems: 'center' }}>
              <div>
                <div style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{p.type?.replace('_', ' ')}</div>
                <div style={{ color: colors.textMuted, fontSize: 11 }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</div>
              </div>
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: 14 }}>Rs.{p.amount}</span>
            </div>
          ))}
          {!recentPayments.length && <p style={{ color: colors.textMuted, fontSize: 13 }}>Koi payment abhi tak nahi hua</p>}
        </div>
      </div>
      {/* Recent Users */}
      <div style={{ background: colors.cardBg, borderRadius: 12, padding: 20, border: `1px solid ${colors.cardBorder}` }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#8b5cf6', marginBottom: 16 }}>👥 Recent Users</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recentUsers.map((u: any) => (
            <div key={u.email} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colors.bg}`, alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                <div style={{ color: colors.textMuted, fontSize: 11 }}>{u.email}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: u.is_premium ? colors.accent : colors.textSecondary, fontSize: 11, fontWeight: u.is_premium ? 700 : 400 }}>{u.is_premium ? '⭐ Premium' : u.role}</div>
                <div style={{ color: colors.textMuted, fontSize: 11 }}>{new Date(u.created_at).toLocaleDateString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
