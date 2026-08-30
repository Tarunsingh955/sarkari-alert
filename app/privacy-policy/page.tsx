'use client'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { useTheme } from '@/components/ui/ThemeProvider'

export default function PrivacyPolicyPage() {
  const { colors } = useTheme()
  const h2: React.CSSProperties = { fontSize: 17, fontWeight: 800, color: colors.textPrimary, marginTop: 26, marginBottom: 10 }
  const p: React.CSSProperties = { marginBottom: 14 }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary }}>
      <Header />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: colors.textPrimary, marginBottom: 6 }}>Privacy Policy</h1>
        <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 24 }}>Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 1.85 }}>
          <p style={p}>SarkariAlert ("we", "us", "our") operates sarkari-alert.com. This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using this website, you agree to the practices described here.</p>

          <h2 style={h2}>Information We Collect</h2>
          <p style={p}>We do not require account creation to browse job listings. If you use our resume builder, membership, or contact form, we collect the information you voluntarily provide, such as your name, email address, and any content you submit. If you subscribe to our premium membership, payment is processed by Razorpay, and we do not store your card or bank details on our own servers.</p>

          <h2 style={h2}>Cookies and Tracking Technologies</h2>
          <p style={p}>Like most websites, we use cookies and similar technologies to improve your experience, remember your theme preference, and understand how visitors use our site.</p>

          <h2 style={h2}>Google Analytics</h2>
          <p style={p}>We use Google Analytics to understand website traffic and usage patterns. Google Analytics uses cookies to collect anonymous information such as pages visited, time spent on the site, and general location. This data helps us improve our content and site performance.</p>

          <h2 style={h2}>Google AdSense and Advertising</h2>
          <p style={p}>This site may display advertisements served by Google AdSense. Google, as a third-party vendor, uses cookies to serve ads based on a user's prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the internet.</p>
          <p style={p}>You may opt out of personalized advertising by visiting Google's Ads Settings at <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" style={{ color: colors.accent, textDecoration: 'none' }}>adssettings.google.com</a>. Alternatively, you can opt out of some third-party vendors' use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" style={{ color: colors.accent, textDecoration: 'none' }}>aboutads.info</a>.</p>

          <h2 style={h2}>Third-Party Links</h2>
          <p style={p}>Our job listings link to official government and recruiting organization websites for applications. We are not responsible for the privacy practices or content of these external sites. We recommend reviewing the privacy policy of any third-party site before submitting personal information.</p>

          <h2 style={h2}>How We Use Your Information</h2>
          <p style={p}>Information you provide (such as through the contact form or resume builder) is used solely to respond to your queries, provide the requested service, and improve our platform. We do not sell your personal information to third parties.</p>

          <h2 style={h2}>Data Security</h2>
          <p style={p}>We take reasonable measures to protect the information you provide, but no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>

          <h2 style={h2}>Children's Privacy</h2>
          <p style={p}>Our services are intended for general audiences and are not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>

          <h2 style={h2}>Changes to This Policy</h2>
          <p style={p}>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.</p>

          <h2 style={h2}>Contact Us</h2>
          <p style={{ ...p, marginBottom: 0 }}>If you have any questions about this Privacy Policy, please reach out via our <a href="/contact" style={{ color: colors.accent, textDecoration: 'none', fontWeight: 600 }}>Contact page</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
