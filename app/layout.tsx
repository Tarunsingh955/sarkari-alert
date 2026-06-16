import type { Metadata, Viewport } from 'next'
import { Noto_Sans } from 'next/font/google'
import Script from 'next/script'

const notoSans = Noto_Sans({ subsets: ['latin'], weight: ['400','600','700','900'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sarkari-alert.in'),
  title: { default: 'SarkariAlert — India #1 Govt Job Portal 2025', template: '%s | SarkariAlert' },
  description: 'Latest Sarkari Naukri 2025. SSC, Railway, UPSC, Banking, State Jobs. Free Resume Builder, Current Affairs, Admit Card, Result, Previous Papers.',
  keywords: ['sarkari naukri','govt jobs 2025','sarkari alert','SSC jobs','railway jobs','UPSC','banking jobs','sarkari result'],
  authors: [{ name: 'SarkariAlert' }],
  openGraph: { type: 'website', locale: 'en_IN', siteName: 'SarkariAlert', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', creator: '@SarkariAlert' },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'SarkariAlert' },
}

export const viewport: Viewport = { themeColor: '#f59e0b', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={notoSans.className} style={{ background: '#0f172a', color: '#fff', margin: 0 }}>
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}</Script>
          </>
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`} crossOrigin="anonymous" strategy="afterInteractive" />
        )}
        <Script id="sw" strategy="afterInteractive">{`if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}`}</Script>
      </body>
    </html>
  )
}
