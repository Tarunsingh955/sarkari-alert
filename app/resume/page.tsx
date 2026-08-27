// app/resume/page.tsx
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import ResumePageClient from '@/components/ui/ResumePageClient'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Free Resume Builder — Sarkari Naukri Resume Banao | SarkariAlert',
  description: 'Free resume builder government job applications ke liye. Multiple templates, instant PDF download.',
}

async function getTemplates() {
  const { data } = await supabaseAdmin.from('resume_templates').select('*').eq('is_active', true).order('sort_order', { ascending: true })
  return data || []
}

export default async function ResumePage() {
  const templates = await getTemplates()

  return (
    <>
      <Header />
      <ResumePageClient templates={templates} />
      <Footer />
    </>
  )
}
