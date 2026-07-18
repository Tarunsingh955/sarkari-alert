import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: paper } = await supabaseAdmin.from('previous_papers').select('pdf_url,downloads').eq('id', id).single()

  if (!paper || !paper.pdf_url) {
    return NextResponse.json({ error: 'Paper not found' }, { status: 404 })
  }

  supabaseAdmin.from('previous_papers').update({ downloads: (paper.downloads || 0) + 1 }).eq('id', id).then(() => {})

  return NextResponse.redirect(paper.pdf_url)
}