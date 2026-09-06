'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'
const CATS = ['SSC','Railway','Banking','UPSC','Defence','Teaching','State','PSC']
export default function AdminPapersPage() {
  const { colors } = useTheme()
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState({ text:'',type:'' })
  const [form, setForm] = useState({ title:'',category:'SSC',year:new Date().getFullYear(),exam_name:'',pdf_url:'',description:'',is_premium:false })
  const showMsg = (text:string,type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),4000) }
  useEffect(()=>{ fetchPapers() },[])
  async function fetchPapers() { setLoading(true); const res=await fetch('/api/admin/papers'); const data=await res.json(); setPapers(data.papers||[]); setLoading(false) }
  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault()
    const res=await fetch('/api/admin/papers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    const data=await res.json()
    if(data.success){ showMsg('Paper add ho gaya!'); setShowForm(false); fetchPapers(); setForm({title:'',category:'SSC',year:new Date().getFullYear(),exam_name:'',pdf_url:'',description:'',is_premium:false}) }
    else showMsg('Error: '+data.error,'error')
  }
  async function deletePaper(id:string) { if(!confirm('Delete?'))return; await fetch('/api/admin/papers',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); showMsg('Deleted!'); fetchPapers() }
  const iS={width:'100%',padding:'10px 14px',background:colors.inputBg,border: `1px solid ${colors.cardBorder}`,borderRadius:8,color:'#fff',fontSize:13,outline:'none',boxSizing:'border-box' as const,marginBottom:10}
  const lS={display:'block' as const,fontSize:10,color:colors.textMuted,fontWeight:600,marginBottom:4,textTransform:'uppercase' as const,letterSpacing:'0.08em'}
  return (
    <div style={{padding:24}}>
      {msg.text&&<div style={{background:msg.type==='error'?'#ef444420':'#10b98120',border:`1px solid ${msg.type==='error'?'#ef444440':'#10b98140'}`,borderRadius:8,padding:'10px 16px',color:msg.type==='error'?'#ef4444':'#34d399',fontSize:13,marginBottom:16,fontWeight:600}}>{msg.text}</div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h1 style={{fontSize:20,fontWeight:900,color:colors.textPrimary,margin:0}}>📄 Previous Papers ({papers.length})</h1>
        <button onClick={()=>setShowForm(!showForm)} style={{background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`,border:'none',borderRadius:8,padding:'10px 20px',color:'#000',fontWeight:700,fontSize:13,cursor:'pointer'}}>{showForm?'Cancel':'+ Add Paper'}</button>
      </div>
      {showForm&&(
        <form onSubmit={handleSubmit} style={{background:colors.cardBg,borderRadius:14,padding:24,marginBottom:20,border: `1px solid ${colors.cardBorder}`}}>
          <h2 style={{color:colors.accent,fontSize:15,marginBottom:18}}>New Paper Add Karo</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
            <div><label style={lS}>Title *</label><input required value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="SSC CGL 2023 Previous Year Paper" style={iS}/></div>
            <div><label style={lS}>Exam Name</label><input value={form.exam_name} onChange={e=>setForm(f=>({...f,exam_name:e.target.value}))} placeholder="SSC CGL" style={iS}/></div>
            <div><label style={lS}>Category *</label><select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{...iS,cursor:'pointer'}}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={lS}>Year</label><input type="number" value={form.year} onChange={e=>setForm(f=>({...f,year:Number(e.target.value)}))} style={iS}/></div>
            <div style={{gridColumn:'1/-1'}}><label style={lS}>PDF URL</label><input value={form.pdf_url} onChange={e=>setForm(f=>({...f,pdf_url:e.target.value}))} placeholder="https://..." style={iS}/></div>
          </div>
          <label style={lS}>Description</label>
          <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Paper ki details..." style={{...iS,height:70,resize:'vertical'}}/>
          <label style={{display:'flex',gap:8,alignItems:'center',color:colors.textSecondary,fontSize:13,cursor:'pointer',marginBottom:14}}>
            <input type="checkbox" checked={form.is_premium} onChange={e=>setForm(f=>({...f,is_premium:e.target.checked}))}/>Premium (Only for premium members)
          </label>
          <button type="submit" style={{background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`,border:'none',borderRadius:8,padding:'12px 32px',color:'#000',fontWeight:800,fontSize:14,cursor:'pointer'}}>Add Paper</button>
        </form>
      )}
      {loading?<div style={{textAlign:'center',color:colors.textMuted,padding:40}}>Loading...</div>:(
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {papers.map((p:any)=>(
            <div key={p.id} style={{background:colors.cardBg,borderRadius:10,padding:'14px 16px',border: `1px solid ${colors.cardBorder}`,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:colors.textPrimary,fontSize:13,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.title}</div>
                <div style={{color:colors.textMuted,fontSize:11,marginTop:2}}>{p.category} • {p.year} • {p.downloads||0} downloads {p.is_premium?'• ⭐ Premium':''}</div>
              </div>
              <div style={{display:'flex',gap:8,flexShrink:0}}>
                {p.pdf_url&&<a href={p.pdf_url} target="_blank" rel="noreferrer" style={{background:'#3b82f622',border:'1px solid #3b82f644',borderRadius:6,padding:'4px 12px',color:'#3b82f6',fontSize:12,textDecoration:'none'}}>PDF</a>}
                <button onClick={()=>deletePaper(p.id)} style={{background:'#ef444420',border:'1px solid #ef444440',borderRadius:6,padding:'4px 12px',color:'#ef4444',fontSize:12,cursor:'pointer',fontWeight:600}}>Delete</button>
              </div>
            </div>
          ))}
          {!papers.length&&<div style={{textAlign:'center',padding:32,color:colors.textMuted}}>Koi paper nahi. Upar se add karein.</div>}
        </div>
      )}
    </div>
  )
}
