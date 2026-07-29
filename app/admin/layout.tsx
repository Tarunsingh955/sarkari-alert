import { getAdminUser } from '@/lib/auth'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/jobs', label: 'Jobs' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/queue', label: 'Review Queue' },
  { href: '/admin/papers', label: 'Previous Papers' },
  { href: '/admin/results', label: 'Results' },
  { href: '/admin/admit-cards', label: 'Admit Cards' },
  { href: '/admin/whatsapp', label: 'WhatsApp' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/membership', label: 'Membership' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/current-affairs', label: 'Current Affairs' },
  { href: '/admin/ticker', label: 'Ticker Messages' },
  { href: '/admin/sources', label: 'Sources' },
  { href: '/admin/seo', label: 'SEO' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser()
  if (!admin) {
    return <>{children}</>
  }
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex' }}>
      <aside style={{ width: 220, background: '#0a0f1e', borderRight: '1px solid #1e293b', padding: '0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#f59e0b' }}>SarkariAlert</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Admin Panel</div>
          <div style={{ marginTop: 10, background: '#1e293b', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{admin.name}</div>
            <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 2 }}>{admin.role}</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => (
            <a key={item.href} href={item.href} style={{ padding: '10px 12px', borderRadius: 8, color: '#94a3b8', fontSize: 12, textDecoration: 'none', display: 'block', fontWeight: 500 }}>
  {item.label}
</a>
          ))}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b' }}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" style={{ width: '100%', padding: '8px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: 8, color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Logout</button>
          </form>
          <a href="/" target="_blank" style={{ display: 'block', textAlign: 'center', marginTop: 8, color: '#64748b', fontSize: 11, textDecoration: 'none' }}>View Website</a>
        </div>
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}