import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import BlogPageClient from '@/components/ui/BlogPageClient'
import type { Metadata } from 'next'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Career Guides & Exam Tips — Sarkari Naukri Preparation | SarkariAlert',
  description: 'Free exam preparation guides, application walkthroughs, and career advice for SSC, Railway, Banking, UPSC and all government job exams.',
}

async function getPosts(searchParams: any) {
  let query = supabaseAdmin.from('blog_posts').select('*').eq('is_published', true).order('created_at', { ascending: false })
  if (searchParams.category) query = query.eq('category', searchParams.category)
  const { data } = await query
  return data || []
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams
  const posts = await getPosts(sp)
  return (
    <>
      <Header />
      <BlogPageClient posts={posts} sp={sp} />
      <Footer />
    </>
  )
}
