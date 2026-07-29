// Simple, free keyword-based category classifier.
// Order matters: more specific patterns are checked before generic ones.
const CATEGORY_RULES: { slug: string; patterns: RegExp[] }[] = [
  { slug: 'upsc', patterns: [/\bupsc\b/i, /union public service/i, /\bcivil services?\b/i] },
  { slug: 'ssc', patterns: [/\bssc\b/i, /staff selection commission/i] },
  { slug: 'railway', patterns: [/\brailway/i, /\brrb\b/i, /rail\s?wheel/i, /metro rail/i] },
  { slug: 'banking', patterns: [/\bbank/i, /\bibps\b/i, /\bsbi\b/i, /\brbi\b/i, /nabard/i] },
  { slug: 'defence', patterns: [/\barmy\b/i, /\bnavy\b/i, /air force/i, /defence/i, /\bdrdo\b/i, /ordnance/i, /\bnda\b/i, /\bcds\b/i, /aerospace/i, /sainik school/i, /military/i, /coast guard/i] },
  { slug: 'teaching', patterns: [/\bteacher/i, /\bteaching\b/i, /\bkvs\b/i, /\bnvs\b/i, /professor/i, /lecturer/i, /vidyalaya/i] },
  { slug: 'psc', patterns: [/public service commission/i, /\bpsc\b/i] },
  { slug: 'state', patterns: [/state government/i, /\bstate govt\b/i] },
]

export function classifyJobCategory(title: string, department?: string): string {
  const text = `${title || ''} ${department || ''}`
  for (const rule of CATEGORY_RULES) {
    if (rule.patterns.some(p => p.test(text))) return rule.slug
  }
  return 'central' // fallback: generic central govt department/ministry postings
}

// Detects whether a mixed-feed news item is actually an admit card, result,
// answer key, or a plain job notification — based on common title phrasing.
export function classifyItemType(title: string): 'admit_card' | 'result' | 'answer_key' | 'job' {
  const t = title || ''
  if (/admit card|hall ticket|call letter|exam city|e-admit/i.test(t)) return 'admit_card'
  if (/\bresult\b|merit list|scorecard|score card|cut ?off|marks\b/i.test(t)) return 'result'
  if (/answer key/i.test(t)) return 'answer_key'
  return 'job'
}