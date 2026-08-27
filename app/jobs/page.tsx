import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import JobsPageClient from '@/components/ui/JobsPageClient'
import type { Metadata } from 'next'

export const revalidate = 120
export const metadata: Metadata = {
  title: 'Sarkari Jobs 2025 — Latest Government Jobs',
  description: 'Latest Sarkari Jobs 2025. Filter by state, category, qualification. SSC, Railway, UPSC, Banking, State, Defence jobs.',
}

async function getJobs(searchParams: any) {
  let query = supabaseAdmin.from('jobs').select(`*,${searchParams.category ? 'categories!inner' : 'categories'}(name,color,icon,slug),states(name)`, { count: 'exact' }).eq('is_published', true).eq('is_active', true)
  if (searchParams.category) query = query.eq('categories.slug', searchParams.category)
  if (searchParams.state) query = query.ilike('department', `%${searchParams.state}%`)
  if (searchParams.search) query = query.or(`title.ilike.%${searchParams.search}%,department.ilike.%${searchParams.search}%`)
  const sort = searchParams.sort || 'newest'
  if (sort === 'deadline') query = query.order('last_date', { ascending: true })
  else if (sort === 'popular') query = query.order('views', { ascending: false })
  else query = query.order('created_at', { ascending: false })
  const page = Number(searchParams.page || 1); const limit = 20
  query = query.range((page-1)*limit, page*limit-1)
  const { data, count } = await query
  return { jobs: data || [], total: count || 0, page, pages: Math.ceil((count||0)/limit) }
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams
  const { jobs, total, page, pages } = await getJobs(sp)
  return (
    <>
      <Header />
      <JobsPageClient jobs={jobs} total={total} page={page} pages={pages} sp={sp} />
      <Footer />
    </>
  )
}
