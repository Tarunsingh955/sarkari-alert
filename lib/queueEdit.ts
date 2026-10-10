import { cleanScrapedContent } from './automation'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// Short single-line fields an admin can change from the review-queue editor.
// Leaving one of these empty means "go back to the automatic value" — the key
// is removed from the stored data so approveQueueItem() falls back to its
// default (e.g. department guessed from the title, "As per notification").
const TEXT_KEYS = [
  'title', 'department', 'total_posts', 'salary_text', 'qualification',
  'age_text', 'exam_date', 'selection_process', 'apply_link', 'question',
] as const

// Long free-text fields. Each gets its own "hand-edited" flag so approve knows
// to publish the admin's text exactly as typed instead of running the
// scraper-boilerplate cleaner over it (which cuts at lines like "for more
// details" and would silently chop an admin's own wording).
const LONG_KEYS: { key: 'content' | 'answer'; flag: 'content_edited' | 'answer_edited' }[] = [
  { key: 'content', flag: 'content_edited' },
  { key: 'answer', flag: 'answer_edited' },
]

export type EditResult =
  | { ok: true; data: Record<string, any>; title: string | undefined }
  | { ok: false; error: string }

export function buildEditedData(oldData: Record<string, any>, fields: Record<string, any>): EditResult {
  const next: Record<string, any> = { ...oldData }

  for (const k of TEXT_KEYS) {
    if (!(k in fields)) continue
    const v = String(fields[k] ?? '').trim().slice(0, 500)
    if (!v) {
      if (k === 'title') return { ok: false, error: 'Title khaali nahi ho sakta' }
      delete next[k]
      continue
    }
    if (k === 'apply_link' && !/^https?:\/\//i.test(v)) {
      return { ok: false, error: 'Apply link http:// ya https:// se shuru hona chahiye' }
    }
    next[k] = v
  }

  if ('last_date' in fields) {
    const v = String(fields.last_date ?? '').trim()
    if (!v) delete next.last_date
    else if (!DATE_RE.test(v)) return { ok: false, error: 'Last date ka format YYYY-MM-DD hona chahiye' }
    else next.last_date = v
  }

  for (const k of ['category_id', 'state_id'] as const) {
    if (!(k in fields)) continue
    const v = String(fields[k] ?? '').trim()
    if (!v) delete next[k]
    else if (!UUID_RE.test(v)) return { ok: false, error: `${k} galat hai` }
    else next[k] = v
  }

  for (const { key, flag } of LONG_KEYS) {
    if (!(key in fields)) continue
    const v = String(fields[key] ?? '').slice(0, 20000).trim()
    const stored = String(oldData[key] ?? '')
    // The form is pre-filled with the *cleaned* version of the scraped text, so
    // only treat it as a real edit if it differs from what's being shown.
    const shownToAdmin = oldData[flag] ? stored : cleanScrapedContent(stored)
    if (v !== shownToAdmin.trim()) {
      next[key] = v
      next[flag] = true
    }
  }

  next.admin_edited = true
  return { ok: true, data: next, title: typeof next.title === 'string' ? next.title : undefined }
}
