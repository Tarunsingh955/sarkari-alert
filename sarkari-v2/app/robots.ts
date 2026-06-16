import { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://sarkari-alert.in'
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/admin', '/api/auth', '/dashboard'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
