import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import PreviousPapersPageClient from '@/components/ui/PreviousPapersPageClient'
import type { Metadata } from 'next'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'Previous Year Papers 2025 — SSC, Railway, UPSC, Banking',
  description: 'Download free previous year question papers for SSC, Railway, UPSC, IBPS, SBI and all govt exams. PDF download available.',
}

async function getPapers(searchParams: any) {
  let query = supabaseAdmin.from('previous_papers').select('*', { count: 'exact' }).eq('is_active', true).order('year', { ascending: false })
  if (searchParams.category) query = query.ilike('category', searchParams.category)
  if (searchParams.year) query = query.eq('year', Number(searchParams.year))
  if (searchParams.search) query = query.ilike('title', `%${searchParams.search}%`)
  const { data, count } = await query
  return { papers: data || [], total: count || 0 }
}

export default async function PreviousPapersPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams
  const { papers, total } = await getPapers(sp)
  return (
    <>
      <Header />
      <PreviousPapersPageClient papers={papers} total={total} sp={sp} />
      <Footer />
    </>
  )
}
