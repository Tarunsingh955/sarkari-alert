import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export default async function MembershipPage() {
  const admin = await getAdminUser(); if (!admin) redirect('/admin/login')
  const [{ data: memberships }, { count: active }, { count: expired }] = await Promise.all([
    supabaseAdmin.from('memberships').select('*,users(name,email)').order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabaseAdmin.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
  ])
  const totalRev = (memberships || []).reduce((s: number, m: any) => s + (m.amount || 0), 0)
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', marginBottom: 20 }}>⭐ Premium Memberships</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
        {[['Active Members', active, '#10b981'], ['Expired', expired, '#ef4444'], ['Total Revenue', `Rs.${totalRev.toLocaleString('en-IN')}`, '#f59e0b'], ['Total Members', (memberships || []).length, '#8b5cf6']].map(([l, v, c]) => (
          <div key={String(l)} style={{ background: '#1e293b', borderRadius: 12, padding: 18, border: '1px solid #334155' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: String(c) }}>{String(v)}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{String(l)}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: '#f59e0b', margin: 0 }}>Recent Memberships</h2>
        </div>
        <div>
          {(memberships || []).map((m: any) => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #0f172a', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 700 }}>{m.users?.name || 'Unknown'}</div>
                <div style={{ color: '#64748b', fontSize: 11 }}>{m.users?.email}</div>
                <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>Plan: {m.plan_name} • Rs.{m.amount} • {new Date(m.start_date).toLocaleDateString('en-IN')} → {new Date(m.end_date).toLocaleDateString('en-IN')}</div>
              </div>
              <span style={{ background: m.status === 'active' ? '#10b98120' : '#ef444420', color: m.status === 'active' ? '#10b981' : '#ef4444', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{m.status}</span>
            </div>
          ))}
          {!(memberships?.length) && <div style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>Koi member nahi hai abhi.</div>}
        </div>
      </div>
    </div>
  )
}
