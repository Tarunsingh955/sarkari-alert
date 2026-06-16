import { getAdminUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
  const admin = await getAdminUser(); if (!admin) redirect('/admin/login')
  const [
    { data: recentPayments }, { data: topJobs }, { data: recentUsers },
    { count: todayViews }, { count: monthViews }, { data: revenue }
  ] = await Promise.all([
    supabaseAdmin.from('payments').select('*').eq('status','success').order('created_at',{ascending:false}).limit(15),
    supabaseAdmin.from('jobs').select('title,slug,views,categories(name)').order('views',{ascending:false}).limit(10),
    supabaseAdmin.from('users').select('name,email,created_at,role,is_premium').order('created_at',{ascending:false}).limit(10),
    supabaseAdmin.from('page_views').select('*',{count:'exact',head:true}).gte('created_at',new Date(Date.now()-86400000).toISOString()),
    supabaseAdmin.from('page_views').select('*',{count:'exact',head:true}).gte('created_at',new Date(Date.now()-30*86400000).toISOString()),
    supabaseAdmin.from('payments').select('amount,type').eq('status','success'),
  ])
  const totalRev = (revenue||[]).reduce((s:number,p:any)=>s+(p.amount||0),0)
  const resumeRev = (revenue||[]).filter((p:any)=>p.type==='resume').reduce((s:number,p:any)=>s+(p.amount||0),0)
  const premRev = (revenue||[]).filter((p:any)=>p.type?.startsWith('premium')).reduce((s:number,p:any)=>s+(p.amount||0),0)
  return (
    <div style={{padding:24}}>
      <h1 style={{fontSize:20,fontWeight:900,color:'#f1f5f9',marginBottom:20}}>📈 Analytics</h1>
      {/* Revenue */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:14,marginBottom:24}}>
        {[['Total Revenue',`Rs.${totalRev.toLocaleString('en-IN')}`,'#10b981'],['Resume Sales',`Rs.${resumeRev.toLocaleString('en-IN')}`,'#f59e0b'],['Premium Revenue',`Rs.${premRev.toLocaleString('en-IN')}`,'#8b5cf6'],['Today Views',(todayViews||0).toLocaleString(),'#3b82f6'],['Monthly Views',(monthViews||0).toLocaleString(),'#ec4899'],['Total Payments',(revenue||[]).length,'#06b6d4']].map(([l,v,c])=>(
          <div key={String(l)} style={{background:'#1e293b',borderRadius:12,padding:18,border:'1px solid #334155'}}>
            <div style={{fontSize:22,fontWeight:900,color:String(c)}}>{String(v)}</div>
            <div style={{fontSize:12,color:'#64748b',marginTop:4}}>{String(l)}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        {/* Top Jobs */}
        <div style={{background:'#1e293b',borderRadius:12,padding:20,border:'1px solid #334155'}}>
          <h2 style={{fontSize:15,fontWeight:800,color:'#f59e0b',marginBottom:16}}>🏆 Top Jobs by Views</h2>
          {(topJobs||[]).map((job:any,i:number)=>(
            <div key={job.slug} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid #0f172a',alignItems:'center'}}>
              <div style={{display:'flex',gap:10,alignItems:'center',flex:1,minWidth:0}}>
                <span style={{color:'#64748b',fontSize:12,fontWeight:700,width:22}}>#{i+1}</span>
                <a href={`/jobs/${job.slug}`} target="_blank" style={{color:'#f1f5f9',fontSize:13,textDecoration:'none',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{job.title}</a>
              </div>
              <span style={{color:'#f59e0b',fontWeight:700,fontSize:13,flexShrink:0}}>{(job.views||0).toLocaleString()}</span>
            </div>
          ))}
        </div>
        {/* Revenue breakdown */}
        <div style={{background:'#1e293b',borderRadius:12,padding:20,border:'1px solid #334155'}}>
          <h2 style={{fontSize:15,fontWeight:800,color:'#10b981',marginBottom:16}}>💰 Recent Payments</h2>
          {(recentPayments||[]).map((p:any)=>(
            <div key={p.id} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid #0f172a',alignItems:'center'}}>
              <div>
                <div style={{color:'#f1f5f9',fontSize:13,fontWeight:600,textTransform:'capitalize'}}>{p.type?.replace('_',' ')}</div>
                <div style={{color:'#64748b',fontSize:11}}>{new Date(p.created_at).toLocaleDateString('en-IN')}</div>
              </div>
              <span style={{color:'#10b981',fontWeight:700,fontSize:14}}>Rs.{p.amount}</span>
            </div>
          ))}
          {!(recentPayments?.length)&&<p style={{color:'#475569',fontSize:13}}>Koi payment abhi tak nahi hua</p>}
        </div>
      </div>
      {/* Recent Users */}
      <div style={{background:'#1e293b',borderRadius:12,padding:20,border:'1px solid #334155'}}>
        <h2 style={{fontSize:15,fontWeight:800,color:'#8b5cf6',marginBottom:16}}>👥 Recent Users</h2>
        <div style={{display:'flex',flexDirection:'column'}}>
          {(recentUsers||[]).map((u:any)=>(
            <div key={u.email} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #0f172a',alignItems:'center',flexWrap:'wrap',gap:8}}>
              <div>
                <div style={{color:'#f1f5f9',fontSize:13,fontWeight:600}}>{u.name}</div>
                <div style={{color:'#64748b',fontSize:11}}>{u.email}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{color:u.is_premium?'#f59e0b':'#94a3b8',fontSize:11,fontWeight:u.is_premium?700:400}}>{u.is_premium?'⭐ Premium':u.role}</div>
                <div style={{color:'#64748b',fontSize:11}}>{new Date(u.created_at).toLocaleDateString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
