'use client'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function MembershipPageClient({ memberships, active, expired, totalRev }: { memberships: any[]; active: number; expired: number; totalRev: number }) {
  const { colors } = useTheme()
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: colors.textPrimary, marginBottom: 20 }}>⭐ Premium Memberships</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
        {[['Active Members', active, '#10b981'], ['Expired', expired, '#ef4444'], ['Total Revenue', `Rs.${totalRev.toLocaleString('en-IN')}`, colors.accent], ['Total Members', memberships.length, '#8b5cf6']].map(([l, v, c]) => (
          <div key={String(l)} style={{ background: colors.cardBg, borderRadius: 12, padding: 18, border: `1px solid ${colors.cardBorder}` }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: String(c) }}>{String(v)}</div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{String(l)}</div>
          </div>
        ))}
      </div>
      <div style={{ background: colors.cardBg, borderRadius: 14, border: `1px solid ${colors.cardBorder}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${colors.cardBorder}` }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: colors.accent, margin: 0 }}>Recent Memberships</h2>
        </div>
        <div>
          {memberships.map((m: any) => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `1px solid ${colors.bg}`, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 700 }}>{m.users?.name || 'Unknown'}</div>
                <div style={{ color: colors.textMuted, fontSize: 11 }}>{m.users?.email}</div>
                <div style={{ color: colors.textSecondary, fontSize: 11, marginTop: 2 }}>Plan: {m.plan_name} • Rs.{m.amount} • {new Date(m.start_date).toLocaleDateString('en-IN')} → {new Date(m.end_date).toLocaleDateString('en-IN')}</div>
              </div>
              <span style={{ background: m.status === 'active' ? '#10b98120' : '#ef444420', color: m.status === 'active' ? '#10b981' : '#ef4444', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{m.status}</span>
            </div>
          ))}
          {!memberships.length && <div style={{ textAlign: 'center', padding: 32, color: colors.textMuted }}>Koi member nahi hai abhi.</div>}
        </div>
      </div>
    </div>
  )
}
