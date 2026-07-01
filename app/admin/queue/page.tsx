'use client'
import { useState, useEffect } from 'react'
export default function AdminQueuePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState({ text:'',type:'' })
  const [running, setRunning] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const showMsg = (text:string,type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),5000) }
  useEffect(()=>{ fetchQueue() },[])
  async function fetchQueue() { setLoading(true); const res=await fetch('/api/admin/queue?status=pending'); const data=await res.json(); setItems(data.items||[]); setSelected([]); setLoading(false) }
  async function runAutomation() { setRunning(true); showMsg('Automation chal rahi hai...'); const res=await fetch('/api/automation'); const data=await res.json(); showMsg(`Done! ${data.fetched||0} items fetched.`); fetchQueue(); setRunning(false) }
  async function handleAction(id:string,action:'approve'|'reject') {
    const res=await fetch('/api/admin/queue',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,id})})
    const data=await res.json()
    if(data.success){ showMsg(data.message||'Done!'); fetchQueue() }
    else showMsg('Error: '+data.error,'error')
  }
  function toggleSelect(id:string) {
    setSelected(prev => prev.includes(id) ? prev.filter(i=>i!==id) : [...prev, id])
  }
  function selectAll() { setSelected(items.map(i=>i.id)) }
  function clearAll() { setSelected([]) }
  async function bulkAction(action:'approve'|'reject') {
    if(selected.length===0){ showMsg('Pehle kuch items select karo!','error'); return }
    if(!confirm(`${selected.length} items ${action} karna chahte ho?`)) return
    setBulkLoading(true)
    showMsg(`${selected.length} items ${action} ho rahe hain...`)
    let success=0, failed=0
    for(const id of selected) {
      const res=await fetch('/api/admin/queue',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,id})})
      const data=await res.json()
      if(data.success) success++; else failed++
    }
    showMsg(`Done! ${success} ${action}d, ${failed} failed.`, failed>0?'error':'success')
    fetchQueue()
    setBulkLoading(false)
  }
  const allSelected = items.length > 0 && selected.length === items.length
  return (
    <div style={{padding:24}}>
      {msg.text&&<div style={{background:msg.type==='error'?'#ef444420':'#10b98120',border:`1px solid ${msg.type==='error'?'#ef444440':'#10b98140'}`,borderRadius:8,padding:'10px 16px',color:msg.type==='error'?'#ef4444':'#34d399',fontSize:13,marginBottom:16,fontWeight:600}}>{msg.text}</div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,flexWrap:'wrap',gap:12}}>
        <div><h1 style={{fontSize:20,fontWeight:900,color:'#f1f5f9',margin:0}}>Review Queue ({items.length})</h1><p style={{color:'#64748b',fontSize:12,marginTop:4}}>Auto-fetched items — approve ya reject karo. Approved items seedha publish honge.</p></div>
        <button onClick={runAutomation} disabled={running} style={{background:running?'#334155':'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:8,padding:'10px 20px',color:running?'#64748b':'#fff',fontWeight:700,fontSize:13,cursor:running?'not-allowed':'pointer'}}>{running?'Running...':'▶ Run Automation Now'}</button>
      </div>

      {/* Bulk Action Bar */}
      {items.length > 0 && (
        <div style={{background:'#1e293b',borderRadius:10,padding:'12px 16px',marginBottom:16,border:'1px solid #334155',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',color:'#94a3b8',fontSize:13}}>
            <input type="checkbox" checked={allSelected} onChange={allSelected?clearAll:selectAll} style={{width:16,height:16,cursor:'pointer'}}/>
            {allSelected ? 'Sab Deselect Karo' : `Sab Select Karo (${items.length})`}
          </label>
          {selected.length > 0 && (
            <>
              <span style={{color:'#f59e0b',fontSize:13,fontWeight:700}}>{selected.length} selected</span>
              <button onClick={()=>bulkAction('approve')} disabled={bulkLoading} style={{background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:8,padding:'7px 16px',color:'#fff',fontWeight:700,fontSize:12,cursor:bulkLoading?'not-allowed':'pointer'}}>
                {bulkLoading?'Processing...':'✅ Approve All Selected'}
              </button>
              <button onClick={()=>bulkAction('reject')} disabled={bulkLoading} style={{background:'#ef444420',border:'1px solid #ef444440',borderRadius:8,padding:'7px 16px',color:'#ef4444',fontWeight:700,fontSize:12,cursor:bulkLoading?'not-allowed':'pointer'}}>
                {bulkLoading?'Processing...':'❌ Reject All Selected'}
              </button>
              <button onClick={clearAll} style={{background:'none',border:'1px solid #334155',borderRadius:8,padding:'7px 12px',color:'#64748b',fontSize:12,cursor:'pointer'}}>Clear</button>
            </>
          )}
        </div>
      )}

      {loading?<div style={{textAlign:'center',color:'#64748b',padding:40}}>Loading...</div>:items.length===0?(
        <div style={{background:'#1e293b',borderRadius:12,padding:48,textAlign:'center',border:'1px solid #334155'}}>
          <div style={{fontSize:48,marginBottom:12}}>✅</div>
          <p style={{color:'#64748b',fontSize:15,marginBottom:12}}>Queue empty hai!</p>
          <button onClick={runAutomation} style={{padding:'10px 24px',background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:8,color:'#000',fontWeight:700,cursor:'pointer'}}>Run Automation</button>
        </div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {items.map((item:any)=>(
            <div key={item.id} style={{background:'#1e293b',borderRadius:12,padding:20,border:`1px solid ${selected.includes(item.id)?'#f59e0b':'#334155'}`,transition:'border 0.15s'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
                <div style={{display:'flex',gap:12,flex:1}}>
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggleSelect(item.id)} style={{width:18,height:18,cursor:'pointer',flexShrink:0,marginTop:2}}/>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                      <span style={{background:'#f59e0b20',color:'#f59e0b',fontSize:10,padding:'2px 8px',borderRadius:4,fontWeight:700}}>{item.type?.toUpperCase()}</span>
                      <span style={{fontSize:11,color:'#64748b'}}>{new Date(item.created_at).toLocaleDateString('en-IN')}</span>
                      {item.source_url&&<a href={item.source_url} target="_blank" rel="noreferrer" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>Source →</a>}
                    </div>
                    <h3 style={{fontSize:15,fontWeight:700,color:'#f1f5f9',marginBottom:8}}>{item.title||item.data?.title}</h3>
                    {item.data?.content&&<p style={{fontSize:12,color:'#94a3b8',lineHeight:1.6,maxHeight:60,overflow:'hidden'}}>{String(item.data.content).slice(0,200)}...</p>}
                  </div>
                </div>
                <div style={{display:'flex',gap:10,flexShrink:0}}>
                  <button onClick={()=>handleAction(item.id,'approve')} style={{background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:8,padding:'9px 18px',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>✅ Approve & Publish</button>
                  <button onClick={()=>handleAction(item.id,'reject')} style={{background:'#ef444420',border:'1px solid #ef444440',borderRadius:8,padding:'9px 18px',color:'#ef4444',fontWeight:700,fontSize:12,cursor:'pointer'}}>❌ Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}