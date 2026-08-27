// app/admit-card/page.tsx
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdmitCardPageClient from '@/components/ui/AdmitCardPageClient'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Admit Card 2025 — Download Sarkari Exam Admit Cards | SarkariAlert',
  description: 'Latest Admit Cards for SSC, Railway, Banking, UPSC, State exams. Download admit card directly.',
}

async function getAdmitCards(searchParams: any) {
  let query = supabaseAdmin
    .from('admit_cards')
    .select('*,jobs(title,slug,department,categories(name,color,icon))', { count: 'exact' })
    .eq('is_active', true)
  if (searchParams.search) query = query.ilike('title', `%${searchParams.search}%`)
  query = query.order('release_date', { ascending: false }).limit(100)
  const { data, count } = await query
  return { items: data || [], total: count || 0 }
}

export default async function AdmitCardPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams
  const { items, total } = await getAdmitCards(sp)

  return (
    <>
      <Header />
      <AdmitCardPageClient items={items} total={total} sp={sp} />
      <Footer />
    </>
  )
}
