import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAdminUser } from '@/lib/auth'
import { approveQueueItem, extractOrgFromTitle, cleanScrapedContent } from '@/lib/automation'
import { classifyJobCategory } from '@/lib/classify'
import { buildEditedData } from '@/lib/queueEdit'

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'pending'
  const { data } = await supabaseAdmin.from('automation_queue').select('*').eq('status', status).order('created_at', { ascending: false }).limit(50)

  // For each item, work out what approve would publish by default (department
  // guessed from the title, auto-detected category, cleaned text). The editor
  // pre-fills its form from this, so the admin sees real values to correct
  // instead of empty boxes.
  const items = (data || []).map((item: any) => {
    const d = item.data || {}
    const title = d.title || item.title || ''
    const department = d.department || extractOrgFromTitle(title) || 'Government of India'
    return {
      ...item,
      suggested: {
        department,
        category_slug: item.type === 'job' ? classifyJobCategory(title, department) : null,
        content: cleanScrapedContent(String(d.content || '')),
        answer: cleanScrapedContent(String(d.answer || '')),
      },
    }
  })
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { action, id } = await req.json()
  if (action === 'approve') { await approveQueueItem(id, admin.id); return NextResponse.json({ success: true, message: 'Approved & Published!' }) }
  if (action === 'reject') { await supabaseAdmin.from('automation_queue').update({ status: 'rejected', reviewed_by: admin.id, reviewed_at: new Date().toISOString() }).eq('id', id); return NextResponse.json({ success: true }) }
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// Edit a pending item's details BEFORE approving it.
export async function PUT(req: NextRequest) {
  const admin = await getAdminUser(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, fields } = await req.json()
    if (!id || !fields || typeof fields !== 'object') return NextResponse.json({ error: 'id aur fields zaroori hain' }, { status: 400 })

    const { data: item } = await supabaseAdmin.from('automation_queue').select('*').eq('id', id).single()
    if (!item) return NextResponse.json({ error: 'Item nahi mila' }, { status: 404 })
    if (item.status !== 'pending') return NextResponse.json({ error: 'Sirf pending items edit ho sakte hain' }, { status: 400 })

    const result = buildEditedData(item.data || {}, fields)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('automation_queue')
      .update({ data: result.data, title: result.title || item.title })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
