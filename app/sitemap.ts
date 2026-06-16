import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://sarkari-alert.in'
  const [{ data: jobs }, { data: news }, { data: papers }] = await Promise.all([
    supabaseAdmin.from('jobs').select('slug,updated_at').eq('is_published', true).limit(5000),
    supabaseAdmin.from('news').select('slug,updated_at').eq('is_published', true).limit(1000),
    supabaseAdmin.from('previous_papers').select('slug,created_at').eq('is_active', true).limit(500),
  ])
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${base}/jobs`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/news`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${base}/current-affairs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/admit-card`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/result`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/answer-key`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/previous-papers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/exam-calendar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/advertise`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]
  const jobPages = (jobs || []).map(j => ({ url: `${base}/jobs/${j.slug}`, lastModified: new Date(j.updated_at), changeFrequency: 'daily' as const, priority: 0.8 }))
  const newsPages = (news || []).map(n => ({ url: `${base}/news/${n.slug}`, lastModified: new Date(n.updated_at), changeFrequency: 'weekly' as const, priority: 0.6 }))
  const paperPages = (papers || []).map(p => ({ url: `${base}/previous-papers/${p.slug}`, lastModified: new Date(p.created_at), changeFrequency: 'monthly' as const, priority: 0.6 }))
  return [...staticPages, ...jobPages, ...newsPages, ...paperPages]
}
