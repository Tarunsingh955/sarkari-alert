import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from('current_affairs').insert({
      question: body.question,
      answer: body.answer,
      option_a: body.option_a,
      option_b: body.option_b,
      option_c: body.option_c || null,
      option_d: body.option_d || null,
      correct_option: body.correct_option,
      explanation: body.explanation || null,
      topic: body.topic || null,
      month: body.month,
      year: Number(body.year),
      is_active: true,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, item: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await supabaseAdmin.from('current_affairs').delete().eq('id', id)
  return NextResponse.json({ success: true })
}