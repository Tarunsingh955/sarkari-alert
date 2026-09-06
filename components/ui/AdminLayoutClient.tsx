'use client'
import { useTheme } from '@/components/ui/ThemeProvider'

const NAV = [
  { href: '/admin/change-password', label: 'Change Password' },
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
  { href: '/admin/blog', label: 'Guides & Articles' },
  { href: '/admin/contact', label: 'Contact Messages' },
  { href: '/admin/ticker', label: 'Ticker Messages' },
  { href: '/admin/sources', label: 'Sources' },
  { href: '/admin/seo', label: 'SEO' },
]

export default function AdminLayoutClient({ admin, children }: { admin: { name: string; role: string }; children: React.ReactNode }) {
  const { colors, themeName, toggleTheme } = useTheme()
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex' }}>
      <aside style={{ width: 220, background: colors.cardBg, borderRight: `1px solid ${colors.cardBorder}`, padding: '0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${colors.cardBorder}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: colors.accent }}>SarkariAlert</div>
            <button onClick={toggleTheme} title="Toggle theme" style={{ background: colors.inputBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 13, color: colors.textSecondary }}>{themeName === 'dark' ? '☀️' : '🌙'}</button>
          </div>
          <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>Admin Panel</div>
          <div style={{ marginTop: 10, background: colors.inputBg, borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary }}>{admin.name}</div>
            <div style={{ fontSize: 10, color: colors.accent, marginTop: 2 }}>{admin.role}</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => (
            <a key={item.href} href={item.href} style={{ padding: '10px 12px', borderRadius: 8, color: colors.textSecondary, fontSize: 12, textDecoration: 'none', display: 'block', fontWeight: 500 }}>
              {item.label}
            </a>
          ))}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.cardBorder}` }}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" style={{ width: '100%', padding: '8px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: 8, color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Logout</button>
          </form>
          <a href="/" target="_blank" style={{ display: 'block', textAlign: 'center', marginTop: 8, color: colors.textMuted, fontSize: 11, textDecoration: 'none' }}>View Website</a>
        </div>
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
