// app/jobs/[slug]/page.tsx
// NOTE: Rename folder from 'slug' to '[slug]' after download
import { supabaseAdmin } from '@/lib/supabase'
import { generateJobMeta, generateJobSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import JobDetailPageClient from '@/components/ui/JobDetailPageClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateStaticParams() {
  // Intentionally pre-build zero pages. Build-time static generation was
  // repeatedly timing out on random jobs due to slow/unstable Supabase
  // connectivity during the Vercel build step. Every job page still works
  // exactly the same for visitors — it's generated on the very first
  // request and cached afterwards (revalidate = 3600 above), so this only
  // changes when the page is built, not what visitors see.
  return []
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params

  const { data: job } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .single()
  if (!job) return { title: 'Job Not Found' }
  const meta = generateJobMeta(job)
  return { title: meta.title, description: meta.description, keywords: meta.keywords, alternates: { canonical: `/jobs/${job.slug}` }, openGraph: { title: meta.title, description: meta.description, type: 'article' } }
}

export default async function JobDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data: job } = await supabaseAdmin
    .from('jobs')
    .select('*,categories(name,color,icon,slug),states(name),admit_cards(*),results(*),answer_keys(*),syllabus(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!job) notFound()

  supabaseAdmin
    .rpc('increment_job_views', { job_slug: slug })
    .then(() => {})

  const jobSchema = generateJobSchema(job)
  const faqSchema = generateFAQSchema(job)
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Jobs', url: '/jobs' }, { name: job.title, url: `/jobs/${job.slug}` }])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <JobDetailPageClient job={job} />
      <Footer />
    </>
  )
}
