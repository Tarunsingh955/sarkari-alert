'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'
export default function AdminJobsPage() {
  const { colors } = useTheme()
  const [jobs, setJobs] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [backfilling, setBackfilling] = useState(false)
  const blankForm = { title:'',department:'',total_posts:'',last_date:'',salary_text:'',salary_min:'',salary_max:'',qualification:'',age_text:'',exam_date:'',apply_link:'',notification_pdf:'',official_website:'',selection_process:'',description:'',notify_text:'Apply Now',category_id:'',state_id:'',is_new:true,is_hot:false,is_published:true }
  const [form, setForm] = useState<any>(blankForm)
  const showMsg = (text:string,type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),4000) }
  useEffect(()=>{ fetchJobs(); fetch('/api/categories').then(r=>r.json()).then(d=>setCategories(d.categories||[])); fetch('/api/states').then(r=>r.json()).then(d=>setStates(d.states||[])) },[])
  async function fetchJobs() {
    setLoading(true)
    const res = await fetch('/api/admin/jobs')
    const data = await res.json()
    setJobs(data.jobs||[]); setLoading(false)
  }
  function startEdit(job:any) {
    setEditingId(job.id)
    setForm({
      title: job.title||'', department: job.department||'', total_posts: job.total_posts||'',
      last_date: job.last_date||'', salary_text: job.salary_text||'', salary_min: job.salary_min||'',
      salary_max: job.salary_max||'', qualification: job.qualification||'', age_text: job.age_text||'',
      exam_date: job.exam_date||'', apply_link: job.apply_link||'', notification_pdf: job.notification_pdf||'',
      official_website: job.official_website||'', selection_process: job.selection_process||'',
      description: job.description||'', notify_text: job.notify_text||'Apply Now', category_id: job.category_id||'', state_id: job.state_id||'',
      is_new: !!job.is_new, is_hot: !!job.is_hot, is_published: !!job.is_published
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function cancelForm() {
    setShowForm(false); setEditingId(null); setForm(blankForm)
  }
  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault()
    const payload = {...form,salary_min:Number(form.salary_min)||0,salary_max:Number(form.salary_max)||0,state_id:form.state_id||null}
    const res = editingId
      ? await fetch('/api/admin/jobs',{ method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editingId,...payload}) })
      : await fetch('/api/admin/jobs',{ method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload) })
    const data = await res.json()
    if(data.success){ showMsg(editingId?'Job update ho gayi!':'Job add ho gayi! Notifications bheje gaye.'); cancelForm(); fetchJobs() }
    else showMsg('Error: '+data.error,'error')
  }
  async function deleteJob(id:string) {
    if(!confirm('Delete karein?')) return
    const res = await fetch('/api/admin/jobs',{ method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id}) })
    const data = await res.json()
    if(data.success){ showMsg('Job deleted!'); fetchJobs() }
    else showMsg('Error: '+data.error,'error')
  }
  async function handleBackfillStates() {
    setBackfilling(true)
    try {
      const previewRes = await fetch('/api/admin/jobs/backfill-states', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dryRun: true }) })
      const preview = await previewRes.json()
      if (preview.error) { showMsg('Error: ' + preview.error, 'error'); setBackfilling(false); return }
      const ok = confirm(`${preview.totalUnassigned} jobs ka state khaali hai.\n${preview.matched} jobs mein state detect ho gaya (department/title text se).\n${preview.unmatched} jobs mein state detect nahi ho paya (unhe manually edit karna padega).\n\nDetect hui ${preview.matched} jobs ko update karein?`)
      if (!ok) { setBackfilling(false); return }
      const applyRes = await fetch('/api/admin/jobs/backfill-states', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dryRun: false }) })
      const result = await applyRes.json()
      if (result.error) showMsg('Error: ' + result.error, 'error')
      else { showMsg(`${result.matched} jobs ka state update ho gaya! ${result.unmatched} jobs manually karni hongi.`); fetchJobs() }
    } catch (e: any) { showMsg('Error: ' + e.message, 'error') }
    setBackfilling(false)
  }
  const iS={width:'100%',padding:'10px 14px',background:colors.inputBg,border:`1px solid ${colors.cardBorder}`,borderRadius:8,color:colors.textPrimary,fontSize:13,outline:'none',boxSizing:'border-box' as const,marginBottom:10}
  const lS={display:'block' as const,fontSize:10,color:colors.textMuted,fontWeight:600,marginBottom:4,textTransform:'uppercase' as const,letterSpacing:'0.08em'}
  return (
    <div style={{padding:24}}>
      {msg.text&&<div style={{background:msg.type==='error'?'#ef444420':'#10b98120',border:`1px solid ${msg.type==='error'?'#ef444440':'#10b98140'}`,borderRadius:8,padding:'10px 16px',color:msg.type==='error'?'#ef4444':'#34d399',fontSize:13,marginBottom:16,fontWeight:600}}>{msg.text}</div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12}}>
        <div><h1 style={{fontSize:20,fontWeight:900,color:colors.textPrimary,margin:0}}>Manage Jobs ({jobs.length})</h1><p style={{color:colors.textMuted,fontSize:12,marginTop:4}}>Sab published aur unpublished jobs</p></div>
        <div style={{display:'flex',gap:10,flexShrink:0}}>
          <button onClick={handleBackfillStates} disabled={backfilling} style={{background:colors.inputBg,border:`1px solid ${colors.cardBorder}`,borderRadius:8,padding:'10px 18px',color:colors.textSecondary,fontWeight:600,fontSize:13,cursor:backfilling?'default':'pointer',opacity:backfilling?0.6:1}}>{backfilling?'Checking...':'Auto-Detect States (Old Jobs)'}</button>
          <button onClick={()=>{ if(showForm) cancelForm(); else setShowForm(true) }} style={{background:`linear-gradient(135deg,${colors.accent},${colors.accentDark})`,border:'none',borderRadius:8,padding:'10px 20px',color:'#000',fontWeight:700,fontSize:13,cursor:'pointer'}}>{showForm?'Cancel':'+ Add New Job'}</button>
        </div>
      </div>
      {showForm&&(
        <form onSubmit={handleSubmit} style={{background:colors.cardBg,borderRadius:14,padding:24,marginBottom:20,border:`1px solid ${colors.cardBorder}`,boxShadow:`0 1px 3px ${colors.cardShadow}`}}>
          <h2 style={{color:colors.accent,fontSize:15,marginBottom:18}}>{editingId?'Job Edit Karo':'New Job Add Karo'}</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
            {[['title','Job Title *','SSC CGL 2025'],['department','Department *','Staff Selection Commission'],['total_posts','Total Posts','17727'],['last_date','Last Date *',''],['salary_text','Salary Text','Rs.25,500 - Rs.81,100'],['salary_min','Salary Min','25500'],['salary_max','Salary Max','81100'],['qualification','Qualification','Graduate'],['age_text','Age Limit','18-32 years'],['exam_date','Exam Date','September 2025'],['apply_link','Apply Link','https://ssc.nic.in'],['notification_pdf','Notification PDF URL','https://...'],['official_website','Official Website','https://ssc.nic.in']].map(([f,l,p])=>(
              <div key={f}><label style={lS}>{l}</label><input type={f==='last_date'?'date':'text'} required={(l as string).includes('*')} value={(form as any)[f]} onChange={e=>setForm((fm:any)=>({...fm,[f]:e.target.value}))} placeholder={p} style={iS}/></div>
            ))}
            <div><label style={lS}>Notify Button</label><select value={form.notify_text} onChange={e=>setForm((f:any)=>({...f,notify_text:e.target.value}))} style={{...iS,cursor:'pointer'}}>{['Apply Now','Notification Out','Coming Soon','Admit Card Out','Result Out','Answer Key Out'].map(n=><option key={n}>{n}</option>)}</select></div>
            <div><label style={lS}>Category *</label><select required value={form.category_id} onChange={e=>setForm((f:any)=>({...f,category_id:e.target.value}))} style={{...iS,cursor:'pointer'}}><option value="">-- Select Category --</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label style={lS}>State (job filter ke liye zaroori)</label><select value={form.state_id} onChange={e=>setForm((f:any)=>({...f,state_id:e.target.value}))} style={{...iS,cursor:'pointer'}}><option value="">-- Select State --</option>{states.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          </div>
          <label style={lS}>Selection Process</label><input value={form.selection_process} onChange={e=>setForm((f:any)=>({...f,selection_process:e.target.value}))} placeholder="Tier-I -> Tier-II -> Document Verification" style={iS}/>
          <label style={lS}>Full Description</label><textarea value={form.description} onChange={e=>setForm((f:any)=>({...f,description:e.target.value}))} placeholder="Job ki poori details..." style={{...iS,height:90,resize:'vertical'}}/>
          <div style={{display:'flex',gap:20,marginBottom:16,flexWrap:'wrap'}}>
            {[['is_new','NEW Badge'],['is_hot','HOT Badge'],['is_published','Publish Now']].map(([k,l])=>(
              <label key={k} style={{display:'flex',gap:8,alignItems:'center',color:colors.textSecondary,fontSize:13,cursor:'pointer'}}><input type="checkbox" checked={(form as any)[k]} onChange={e=>setForm((f:any)=>({...f,[k]:e.target.checked}))}/> {l}</label>
            ))}
          </div>
          <button type="submit" style={{background:`linear-gradient(135deg,${colors.accent},${colors.accentDark})`,border:'none',borderRadius:8,padding:'12px 32px',color:'#000',fontWeight:800,fontSize:14,cursor:'pointer'}}>{editingId?'Update Job':'Add Job & Send Notifications'}</button>
        </form>
      )}
      {loading?<div style={{textAlign:'center',color:colors.textMuted,padding:40}}>Loading...</div>:(
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {jobs.map((job:any)=>(
            <div key={job.id} style={{background:colors.cardBg,borderRadius:10,padding:'14px 16px',border:`1px solid ${colors.cardBorder}`,boxShadow:`0 1px 3px ${colors.cardShadow}`,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:colors.textPrimary,fontSize:14,fontWeight:700,marginBottom:2}}>{job.title}</div>
                <div style={{color:colors.textMuted,fontSize:11}}>{job.department} - {job.total_posts} posts - Last: {job.last_date} - Views: {(job.views||0).toLocaleString()}</div>
                <div style={{display:'flex',gap:6,marginTop:6}}>
                  {job.is_published&&<span style={{background:'#10b98120',color:'#10b981',fontSize:10,padding:'1px 8px',borderRadius:20,fontWeight:700}}>Published</span>}
                  {!job.is_published&&<span style={{background:colors.inputBg,color:colors.textMuted,fontSize:10,padding:'1px 8px',borderRadius:20}}>Draft</span>}
                  {job.is_new&&<span style={{background:'#3b82f620',color:'#3b82f6',fontSize:10,padding:'1px 8px',borderRadius:20}}>New</span>}
                  {job.is_hot&&<span style={{background:'#ef444420',color:'#ef4444',fontSize:10,padding:'1px 8px',borderRadius:20}}>Hot</span>}
                </div>
              </div>
              <div style={{display:'flex',gap:8,flexShrink:0}}>
                <a href={`/jobs/${job.slug}`} target="_blank" rel="noreferrer" style={{background:'#1e40af22',border:'1px solid #1e40af44',borderRadius:6,padding:'5px 12px',color:'#60a5fa',fontSize:12,textDecoration:'none'}}>View</a>
                <button onClick={()=>startEdit(job)} style={{background:'#f59e0b22',border:'1px solid #f59e0b44',borderRadius:6,padding:'5px 12px',color:'#f59e0b',fontSize:12,cursor:'pointer',fontWeight:600}}>Edit</button>
                <button onClick={()=>deleteJob(job.id)} style={{background:'#ef444420',border:'1px solid #ef444440',borderRadius:6,padding:'5px 12px',color:'#ef4444',fontSize:12,cursor:'pointer',fontWeight:600}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
