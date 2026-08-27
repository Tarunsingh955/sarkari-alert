// app/news/page.tsx
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import NewsPageClient from '@/components/ui/NewsPageClient'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Sarkari Naukri News — Latest Updates | SarkariAlert',
  description: 'Latest sarkari naukri news, government announcements aur updates ek jagah.',
}

async function getNews() {
  const { data, count } = await supabaseAdmin
    .from('news')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(50)
  return { items: data || [], total: count || 0 }
}

export default async function NewsPage() {
  const { items, total } = await getNews()

  return (
    <>
      <Header />
      <NewsPageClient items={items} total={total} />
      <Footer />
    </>
  )
}
