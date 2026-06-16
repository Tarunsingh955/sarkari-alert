'use client'
import { useState, useEffect } from 'react'
export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [form, setForm] = useState({ title:'',department:'',total_posts:'',last_date:'',salary_text:'',salary_min:'',salary_max:'',qualification:'',age_text:'',exam_date:'',apply_link:'',notification_pdf:'',official_website:'',selection_process:'',description:'',notify_text:'Apply Now',is_new:true,is_hot:false,is_published:true })
  const showMsg = (text:string,type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),4000) }
  useEffect(()=>{ fetchJobs() },[])
  async function fetchJobs() {
    setLoading(true)
    const res = await fetch('/api/admin/jobs')
    const data = await res.json()
    setJobs(data.jobs||[]); setLoading(false)
  }
  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/jobs',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,salary_min:Number(form.salary_min)||0,salary_max:Number(form.salary_max)||0}) })
    const data = await res.json()
    if(data.success){ showMsg('Job add ho gayi! Notifications bheje gaye.'); setShowForm(false); fetchJobs() }
    else showMsg('Error: '+data.error,'error')
  }
  async function deleteJob(id:string) {
    if(!confirm('Delete karein?')) return
    const res = await fetch('/api/admin/jobs',{ method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id}) })
    const data = await res.json()
    if(data.success){ showMsg('Job deleted!'); fetchJobs() }
    else showMsg('Error: '+data.error,'error')
  }
  const iS={width:'100%',padding:'10px 14px',background:'#0f172a',border:'1px solid #334155',borderRadius:8,color:'#fff',fontSize:13,outline:'none',boxSizing:'border-box' as const,marginBottom:10}
  const lS={display:'block' as const,fontSize:10,color:'#64748b',fontWeight:600,marginBottom:4,textTransform:'uppercase' as const,letterSpacing:'0.08em'}
  return (
    <div style={{padding:24}}>
      {msg.text&&<div style={{background:msg.type==='error'?'#ef444420':'#10b98120',border:`1px solid ${msg.type==='error'?'#ef444440':'#10b98140'}`,borderRadius:8,padding:'10px 16px',color:msg.type==='error'?'#ef4444':'#34d399',fontSize:13,marginBottom:16,fontWeight:600}}>{msg.text}</div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div><h1 style={{fontSize:20,fontWeight:900,color:'#f1f5f9',margin:0}}>Manage Jobs ({jobs.length})</h1><p style={{color:'#64748b',fontSize:12,marginTop:4}}>Sab published aur unpublished jobs</p></div>
        <button onClick={()=>setShowForm(!showForm)} style={{background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:8,padding:'10px 20px',color:'#000',fontWeight:700,fontSize:13,cursor:'pointer'}}>{showForm?'Cancel':'+ Add New Job'}</button>
      </div>
      {showForm&&(
        <form onSubmit={handleSubmit} style={{background:'#1e293b',borderRadius:14,padding:24,marginBottom:20,border:'1px solid #334155'}}>
          <h2 style={{color:'#f59e0b',fontSize:15,marginBottom:18}}>New Job Add Karo</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
            {[['title','Job Title *','SSC CGL 2025'],['department','Department *','Staff Selection Commission'],['total_posts','Total Posts','17727'],['last_date','Last Date *',''],['salary_text','Salary Text','Rs.25,500 - Rs.81,100'],['salary_min','Salary Min','25500'],['salary_max','Salary Max','81100'],['qualification','Qualification','Graduate'],['age_text','Age Limit','18-32 years'],['exam_date','Exam Date','September 2025'],['apply_link','Apply Link','https://ssc.nic.in'],['notification_pdf','Notification PDF URL','https://...'],['official_website','Official Website','https://ssc.nic.in']].map(([f,l,p])=>(
              <div key={f}><label style={lS}>{l}</label><input type={f==='last_date'?'date':'text'} required={l.includes('*')} value={(form as any)[f]} onChange={e=>setForm(fm=>({...fm,[f]:e.target.value}))} placeholder={p} style={iS}/></div>
            ))}
            <div><label style={lS}>Notify Button</label><select value={form.notify_text} onChange={e=>setForm(f=>({...f,notify_text:e.target.value}))} style={{...iS,cursor:'pointer'}}>{['Apply Now','Notification Out','Coming Soon','Admit Card Out','Result Out','Answer Key Out'].map(n=><option key={n}>{n}</option>)}</select></div>
          </div>
          <label style={lS}>Selection Process</label><input value={form.selection_process} onChange={e=>setForm(f=>({...f,selection_process:e.target.value}))} placeholder="Tier-I → Tier-II → Document Verification" style={iS}/>
          <label style={lS}>Full Description</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Job ki poori details..." style={{...iS,height:90,resize:'vertical'}}/>
          <div style={{display:'flex',gap:20,marginBottom:16,flexWrap:'wrap'}}>
            {[['is_new','NEW Badge'],['is_hot','HOT Badge'],['is_published','Publish Now']].map(([k,l])=>(
              <label key={k} style={{display:'flex',gap:8,alignItems:'center',color:'#94a3b8',fontSize:13,cursor:'pointer'}}><input type="checkbox" checked={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.checked}))}/> {l}</label>
            ))}
          </div>
          <button type="submit" style={{background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:8,padding:'12px 32px',color:'#000',fontWeight:800,fontSize:14,cursor:'pointer'}}>Add Job & Send Notifications</button>
        </form>
      )}
      {loading?<div style={{textAlign:'center',color:'#64748b',padding:40}}>Loading...</div>:(
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {jobs.map((job:any)=>(
            <div key={job.id} style={{background:'#1e293b',borderRadius:10,padding:'14px 16px',border:'1px solid #334155',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:'#f1f5f9',fontSize:14,fontWeight:700,marginBottom:2}}>{job.title}</div>
                <div style={{color:'#64748b',fontSize:11}}>{job.department} • {job.total_posts} posts • Last: {job.last_date} • Views: {(job.views||0).toLocaleString()}</div>
                <div style={{display:'flex',gap:6,marginTop:6}}>
                  {job.is_published&&<span style={{background:'#10b98120',color:'#10b981',fontSize:10,padding:'1px 8px',borderRadius:20,fontWeight:700}}>Published</span>}
                  {!job.is_published&&<span style={{background:'#33415520',color:'#64748b',fontSize:10,padding:'1px 8px',borderRadius:20}}>Draft</span>}
                  {job.is_new&&<span style={{background:'#3b82f620',color:'#3b82f6',fontSize:10,padding:'1px 8px',borderRadius:20}}>New</span>}
                  {job.is_hot&&<span style={{background:'#ef444420',color:'#ef4444',fontSize:10,padding:'1px 8px',borderRadius:20}}>Hot</span>}
                </div>
              </div>
              <div style={{display:'flex',gap:8,flexShrink:0}}>
                <a href={`/jobs/${job.slug}`} target="_blank" rel="noreferrer" style={{background:'#1e40af22',border:'1px solid #1e40af44',borderRadius:6,padding:'5px 12px',color:'#60a5fa',fontSize:12,textDecoration:'none'}}>View</a>
                <button onClick={()=>deleteJob(job.id)} style={{background:'#ef444420',border:'1px solid #ef444440',borderRadius:6,padding:'5px 12px',color:'#ef4444',fontSize:12,cursor:'pointer',fontWeight:600}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
