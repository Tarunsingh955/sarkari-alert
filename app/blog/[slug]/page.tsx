// app/blog/[slug]/page.tsx
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import BlogDetailPageClient from '@/components/ui/BlogDetailPageClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await supabaseAdmin.from('blog_posts').select('*').eq('slug', slug).single()
  if (!post) return { title: 'Article Not Found' }
  const description = post.excerpt || post.content.slice(0, 155)
  return {
    title: `${post.title} | SarkariAlert`,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description, type: 'article' },
  }
}

export default async function BlogDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { data: post } = await supabaseAdmin.from('blog_posts').select('*').eq('slug', slug).eq('is_published', true).single()
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: { '@type': 'Organization', name: 'SarkariAlert' },
    publisher: { '@type': 'Organization', name: 'SarkariAlert' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Header />
      <BlogDetailPageClient post={post} />
      <Footer />
    </>
  )
}
