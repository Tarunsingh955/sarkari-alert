'use client'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function AboutPage() {
  const { colors } = useTheme()
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <Header />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: colors.textPrimary, marginBottom: 20 }}>About SarkariAlert</h1>

        <div style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 18 }}>SarkariAlert (sarkari-alert.com) is a dedicated platform built to make finding genuine government job opportunities in India simple and reliable. Every day, thousands of recruitment notifications are released across central government departments, state governments, railways, banking institutions, and public sector organizations — and it can be genuinely hard to keep track of all of it. That's the problem SarkariAlert exists to solve.</p>

          <p style={{ marginBottom: 18 }}>The platform is built and maintained by Tarun, an independent developer who set out to build a single, well-organized place where job seekers could find verified vacancy details, application deadlines, eligibility criteria, admit cards, results, and previous year question papers — all without having to sift through cluttered or unreliable sources.</p>

          <h2 style={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, marginTop: 28, marginBottom: 12 }}>What We Do</h2>
          <p style={{ marginBottom: 18 }}>We aggregate and organize government job listings, admit card releases, exam results, and answer keys from official sources, and present them in a clean, easy-to-navigate format. Wherever possible, we link directly to the official recruiting organization's website so candidates can apply with confidence, rather than relying on third-party intermediaries.</p>

          <p style={{ marginBottom: 18 }}>Beyond job listings, SarkariAlert also offers a free resume builder designed specifically for government job applications, current affairs practice questions for exam preparation, and a growing library of original guides covering application processes, exam patterns, and preparation strategies for major exams like SSC CGL, Railway RRB, and Bank PO.</p>

          <h2 style={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, marginTop: 28, marginBottom: 12 }}>Our Commitment</h2>
          <p style={{ marginBottom: 18 }}>We understand that a missed deadline or an unclear eligibility requirement can mean a lost opportunity. That's why accuracy and timeliness are at the core of everything we publish. Information is sourced and cross-checked against official notifications, and updated as new details become available.</p>

          <p style={{ marginBottom: 18 }}>SarkariAlert is an independent platform and is not affiliated with any government department or recruitment board. We always recommend candidates verify final details on the official website before applying or making any payment.</p>

          <p style={{ marginBottom: 0 }}>Have feedback, found an error, or want to suggest something? Reach out via our <a href="/contact" style={{ color: colors.accent, textDecoration: 'none', fontWeight: 600 }}>Contact page</a> — we'd love to hear from you.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
