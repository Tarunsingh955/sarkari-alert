import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import HomePageClient from '@/components/ui/HomePageClient'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'SarkariAlert — India #1 Govt Job Portal 2025',
  description: 'Latest Sarkari Naukri 2025. SSC, Railway, UPSC, Banking, State Jobs. Free Resume Builder, Current Affairs, Admit Card.',
}

async function getData() {
  const [{ data: jobs }, { data: news }, { data: hotJobs }] = await Promise.all([
    supabaseAdmin.from('jobs').select('*,categories(name,color,icon,slug),states(name)').eq('is_published', true).eq('is_active', true).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('news').select('*').eq('is_published', true).eq('is_active', true).order('created_at', { ascending: false }).limit(8),
    supabaseAdmin.from('jobs').select('*,categories(name,color,icon,slug),states(name)').eq('is_published', true).eq('is_active', true).eq('is_hot', true).order('views', { ascending: false }).limit(5),
  ])
  return { jobs: jobs || [], news: news || [], hotJobs: hotJobs || [] }
}

export default async function HomePage() {
  const { jobs, news, hotJobs } = await getData()
  return (
    <>
      <Header />
      <HomePageClient jobs={jobs} news={news} hotJobs={hotJobs} />
      <Footer />
    </>
  )
}
