import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import ResultPageClient from '@/components/ui/ResultPageClient'
import type { Metadata } from 'next'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'Sarkari Result 2026 — Latest Govt Job Results',
  description: 'Check latest Sarkari Result for SSC, Railway, UPSC, Banking and all govt exams. Download result PDF and check merit list.',
}

async function getResults(searchParams: any) {
  let query = supabaseAdmin.from('results').select('*', { count: 'exact' }).eq('is_active', true).order('release_date', { ascending: false })
  if (searchParams.search) query = query.ilike('title', `%${searchParams.search}%`)
  const { data, count } = await query
  return { results: data || [], total: count || 0 }
}

export default async function ResultPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams
  const { results, total } = await getResults(sp)
  return (
    <>
      <Header />
      <ResultPageClient results={results} total={total} sp={sp} />
      <Footer />
    </>
  )
}
