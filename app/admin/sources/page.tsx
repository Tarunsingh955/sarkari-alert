'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'
export default function AdminSourcesPage() {
  const { colors } = useTheme()
  const [sources, setSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState({ text:'',type:'' })
  const [newSource, setNewSource] = useState({ name:'',url:'',type:'rss',category:'general' })
  const [running, setRunning] = useState(false)
  const showMsg = (text:string,type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),4000) }
  useEffect(()=>{ fetchSources() },[])
  async function fetchSources() { setLoading(true); const res=await fetch('/api/admin/sources').catch(()=>({json:async()=>({})})); const data=await (res as any).json?.()??{}; setSources(data.sources||[]); setLoading(false) }
 async function runAuto() { setRunning(true); showMsg('Automation chal rahi hai...'); try{ const r=await fetch('/api/admin/run-automation',{method:'POST'}); const d=await r.json(); showMsg(`Done! ${d.fetched||0} new items queue mein.`) }catch{ showMsg('Error running automation','error') } setRunning(false) }
  async function toggleSource(id:string,active:boolean) { await fetch('/api/admin/sources',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,is_active:active})}); fetchSources() }
  async function deleteSource(id:string) { if(!confirm('Delete?'))return; await fetch('/api/admin/sources',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); fetchSources() }
  async function addSource(e:React.FormEvent) {
    e.preventDefault()
    const res=await fetch('/api/admin/sources',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newSource)})
    const data=await res.json()
    if(data.success){ showMsg('Source add ho gaya!'); setNewSource({name:'',url:'',type:'rss',category:'general'}); fetchSources() }
    else showMsg('Error: '+data.error,'error')
  }
  const iS={width:'100%',padding:'10px 14px',background:colors.inputBg,border: `1px solid ${colors.cardBorder}`,borderRadius:8,color:'#fff',fontSize:13,outline:'none',boxSizing:'border-box' as const,marginBottom:10}
  const lS={display:'block' as const,fontSize:10,color:colors.textMuted,fontWeight:600,marginBottom:4,textTransform:'uppercase' as const,letterSpacing:'0.08em'}
  return (
    <div style={{padding:24}}>
      {msg.text&&<div style={{background:msg.type==='error'?'#ef444420':'#10b98120',border:`1px solid ${msg.type==='error'?'#ef444440':'#10b98140'}`,borderRadius:8,padding:'10px 16px',color:msg.type==='error'?'#ef4444':'#34d399',fontSize:13,marginBottom:16,fontWeight:600}}>{msg.text}</div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h1 style={{fontSize:20,fontWeight:900,color:colors.textPrimary,margin:0}}>🤖 Automation Sources</h1>
        <button onClick={runAuto} disabled={running} style={{background:running?colors.cardBorder:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:8,padding:'10px 20px',color:running?colors.textMuted:'#fff',fontWeight:700,fontSize:13,cursor:running?'not-allowed':'pointer'}}>{running?'Running...':'▶ Run Automation Now'}</button>
      </div>
      {/* Add Source Form */}
      <form onSubmit={addSource} style={{background:colors.cardBg,borderRadius:14,padding:20,marginBottom:20,border: `1px solid ${colors.cardBorder}`}}>
        <h2 style={{color:colors.accent,fontSize:14,fontWeight:800,marginBottom:14}}>➕ Naya Source Add Karo</h2>
        <div style={{display:'grid',gridTemplateColumns:'2fr 3fr 1fr 1fr',gap:'0 12px'}}>
          <div><label style={lS}>Source Name</label><input value={newSource.name} onChange={e=>setNewSource(s=>({...s,name:e.target.value}))} required placeholder="Employment News" style={iS}/></div>
          <div><label style={lS}>RSS/API URL</label><input value={newSource.url} onChange={e=>setNewSource(s=>({...s,url:e.target.value}))} required placeholder="https://..." style={iS}/></div>
          <div><label style={lS}>Type</label><select value={newSource.type} onChange={e=>setNewSource(s=>({...s,type:e.target.value}))} style={{...iS,cursor:'pointer'}}>{['rss','api','website'].map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={lS}>Category</label><select value={newSource.category} onChange={e=>setNewSource(s=>({...s,category:e.target.value}))} style={{...iS,cursor:'pointer'}}>{['general','ssc','upsc','railway','banking','state','defence'].map(c=><option key={c}>{c}</option>)}</select></div>
        </div>
        <button type="submit" style={{background: `linear-gradient(135deg,${colors.accent},${colors.accentDark})`,border:'none',borderRadius:8,padding:'10px 24px',color:'#000',fontWeight:700,fontSize:13,cursor:'pointer'}}>Add Source</button>
      </form>
      {/* Recommended Free Sources */}
      <div style={{background:colors.cardBg,borderRadius:12,padding:18,marginBottom:20,border: `1px solid ${colors.cardBorder}`}}>
        <h3 style={{color:colors.accent,fontSize:13,fontWeight:700,marginBottom:12}}>💡 Recommended Free RSS Feeds</h3>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {[['Employment News','https://www.employmentnews.gov.in/rss','general'],['UPSC','https://www.upsc.gov.in/rss','upsc'],['SSC','https://ssc.nic.in/rss','ssc'],['PIB India','https://www.pib.gov.in/rss/rss.aspx','general'],['Govt Jobs India','https://www.govtjobsindia.net/feed','general']].map(([n,u,c])=>(
            <div key={n} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom: `1px solid ${colors.bg}`,gap:12,flexWrap:'wrap'}}>
              <div><div style={{color:colors.textPrimary,fontSize:13,fontWeight:600}}>{n}</div><div style={{color:colors.textMuted,fontSize:11}}>{u}</div></div>
              <button onClick={()=>setNewSource({name:n,url:u,type:'rss',category:c})} style={{background:'#1e40af22',border:'1px solid #1e40af44',borderRadius:6,padding:'4px 12px',color:'#60a5fa',fontSize:12,cursor:'pointer'}}>Use This →</button>
            </div>
          ))}
        </div>
      </div>
      {/* Source List */}
      {loading?<div style={{textAlign:'center',color:colors.textMuted,padding:40}}>Loading...</div>:(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {sources.map((s:any)=>(
            <div key={s.id} style={{background:colors.cardBg,borderRadius:10,padding:'14px 16px',border: `1px solid ${colors.cardBorder}`,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <div style={{flex:1}}>
                <div style={{color:colors.textPrimary,fontSize:14,fontWeight:700,marginBottom:2}}>{s.name}</div>
                <div style={{color:colors.textMuted,fontSize:11,wordBreak:'break-all'}}>{s.url}</div>
                <div style={{display:'flex',gap:8,marginTop:6}}>
                  <span style={{background: `${colors.accent}20`,color:colors.accent,fontSize:10,padding:'1px 8px',borderRadius:20,fontWeight:700}}>{s.type?.toUpperCase()}</span>
                  <span style={{background:'#3b82f620',color:'#3b82f6',fontSize:10,padding:'1px 8px',borderRadius:20}}>{s.category}</span>
                  <span style={{fontSize:11,color:colors.textMuted}}>Last check: {s.last_checked?new Date(s.last_checked).toLocaleDateString('en-IN'):'Never'}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:8,flexShrink:0}}>
                <button onClick={()=>toggleSource(s.id,!s.is_active)} style={{background:s.is_active?'#10b98120':'#33415520',border:`1px solid ${s.is_active?'#10b98140':'#33415540'}`,borderRadius:6,padding:'5px 12px',color:s.is_active?'#10b981':colors.textMuted,fontSize:12,cursor:'pointer',fontWeight:600}}>{s.is_active?'Active':'Inactive'}</button>
                <button onClick={()=>deleteSource(s.id)} style={{background:'#ef444420',border:'1px solid #ef444440',borderRadius:6,padding:'5px 12px',color:'#ef4444',fontSize:12,cursor:'pointer'}}>Delete</button>
              </div>
            </div>
          ))}
          {!sources.length&&<div style={{textAlign:'center',padding:32,color:colors.textMuted}}>Koi source nahi hai. Upar se add karein.</div>}
        </div>
      )}
    </div>
  )
}
