import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import AdBanner from '@/components/ui/AdBanner'
import JobCard from '@/components/ui/JobCard'
import type { Metadata } from 'next'

export const revalidate = 120
export const metadata: Metadata = {
  title: 'Sarkari Jobs 2025 — Latest Government Jobs',
  description: 'Latest Sarkari Jobs 2025. Filter by state, category, qualification. SSC, Railway, UPSC, Banking, State, Defence jobs.',
}

const CATEGORIES = ['Central','State','Railway','Banking','Teaching','Defence','SSC','UPSC','PSC']
const STATES = ['Uttar Pradesh','Bihar','Rajasthan','Madhya Pradesh','Maharashtra','Delhi','Haryana','Punjab','Gujarat','Karnataka','Tamil Nadu','West Bengal','Uttarakhand','Himachal Pradesh']

async function getJobs(searchParams: any) {
  let query = supabaseAdmin.from('jobs').select('*,categories(name,color,icon,slug),states(name)', { count: 'exact' }).eq('is_published', true).eq('is_active', true)
  if (searchParams.category) query = query.ilike('department', `%${searchParams.category}%`)
  if (searchParams.state) query = query.ilike('department', `%${searchParams.state}%`)
  if (searchParams.search) query = query.or(`title.ilike.%${searchParams.search}%,department.ilike.%${searchParams.search}%`)
  const sort = searchParams.sort || 'newest'
  if (sort === 'deadline') query = query.order('last_date', { ascending: true })
  else if (sort === 'popular') query = query.order('views', { ascending: false })
  else query = query.order('created_at', { ascending: false })
  const page = Number(searchParams.page || 1); const limit = 20
  query = query.range((page-1)*limit, page*limit-1)
  const { data, count } = await query
  return { jobs: data || [], total: count || 0, page, pages: Math.ceil((count||0)/limit) }
}

export default async function JobsPage({ searchParams }: { searchParams: any }) {
  const { jobs, total, page, pages } = await getJobs(searchParams)
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>Sarkari Jobs 2025</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>Latest Government Jobs — Updated Daily | {total} Jobs Available</p>
        </div>
        <AdBanner position="header" />
        {/* Filters */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 14, border: '1px solid #334155' }}>
          <form method="GET" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input name="search" defaultValue={searchParams.search || ''} placeholder="🔍 Search — SSC, Railway, Police, Bank, Teacher..." style={{ width: '100%', padding: '12px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#64748b', alignSelf: 'center' }}>Category:</span>
              <a href="/jobs" style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: !searchParams.category ? '#f59e0b' : '#0f172a', border: `1px solid ${!searchParams.category ? '#f59e0b' : '#334155'}`, color: !searchParams.category ? '#000' : '#94a3b8', textDecoration: 'none', fontWeight: !searchParams.category ? 700 : 400 }}>Sab</a>
              {CATEGORIES.map(c => <a key={c} href={`/jobs?category=${c.toLowerCase()}`} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: searchParams.category === c.toLowerCase() ? '#f59e0b' : '#0f172a', border: `1px solid ${searchParams.category === c.toLowerCase() ? '#f59e0b' : '#334155'}`, color: searchParams.category === c.toLowerCase() ? '#000' : '#94a3b8', textDecoration: 'none', fontWeight: searchParams.category === c.toLowerCase() ? 700 : 400 }}>{c}</a>)}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#64748b', alignSelf: 'center' }}>State:</span>
              {STATES.map(s => <a key={s} href={`/jobs?state=${encodeURIComponent(s)}`} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: searchParams.state === s ? '#10b981' : '#0f172a', border: `1px solid ${searchParams.state === s ? '#10b981' : '#334155'}`, color: searchParams.state === s ? '#000' : '#94a3b8', textDecoration: 'none', fontWeight: searchParams.state === s ? 700 : 400 }}>{s}</a>)}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>Sort:</span>
              {[['newest','Newest'],['deadline','Last Date'],['popular','Popular']].map(([v,l]) => <a key={v} href={`/jobs?sort=${v}`} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, background: (searchParams.sort||'newest')===v ? '#8b5cf6' : '#0f172a', border: `1px solid ${(searchParams.sort||'newest')===v ? '#8b5cf6' : '#334155'}`, color: (searchParams.sort||'newest')===v ? '#fff' : '#94a3b8', textDecoration: 'none' }}>{l}</a>)}
              <button type="submit" style={{ padding: '5px 16px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 20, color: '#000', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Search</button>
            </div>
          </form>
        </div>
        {(searchParams.category || searchParams.state || searchParams.search) && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Active:</span>
            {searchParams.category && <span style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>Category: {searchParams.category}</span>}
            {searchParams.state && <span style={{ background: '#10b98120', color: '#10b981', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>State: {searchParams.state}</span>}
            {searchParams.search && <span style={{ background: '#8b5cf620', color: '#8b5cf6', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>Search: "{searchParams.search}"</span>}
            <a href="/jobs" style={{ color: '#ef4444', fontSize: 12, textDecoration: 'none' }}>✕ Clear</a>
          </div>
        )}
        <div style={{ color: '#64748b', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{total} jobs mile</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 12 }}>
          {jobs.map((job, i) => (
            <div key={job.id}>
              {i === 6 && <div style={{ gridColumn: '1/-1' }}><AdBanner position="between_jobs" height={60} /></div>}
              <JobCard job={job} />
            </div>
          ))}
        </div>
        {!jobs.length && (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 16, marginBottom: 8 }}>Koi job nahi mila!</p>
            <a href="/jobs" style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8, color: '#000', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>Sab Jobs Dekho</a>
          </div>
        )}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <a key={p} href={`/jobs?page=${p}`} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, background: page === p ? '#f59e0b' : '#1e293b', border: `1px solid ${page === p ? '#f59e0b' : '#334155'}`, color: page === p ? '#000' : '#94a3b8', fontWeight: page === p ? 700 : 400, textDecoration: 'none' }}>{p}</a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
