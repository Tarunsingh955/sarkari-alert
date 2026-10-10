'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'

type FieldKind = 'text' | 'date' | 'textarea' | 'category' | 'state'
const FIELD_DEFS: Record<string, { label: string; kind: FieldKind; placeholder?: string; hint?: string }> = {
  title: { label: 'Title *', kind: 'text' },
  department: { label: 'Department / Organization', kind: 'text', hint: 'Khaali chhodoge to title se auto-guess hoga' },
  total_posts: { label: 'Total Posts', kind: 'text', placeholder: 'e.g. 579', hint: 'Khaali = "As per notification"' },
  last_date: { label: 'Last Date', kind: 'date', hint: 'Khaali = aaj se 30 din baad' },
  salary_text: { label: 'Salary', kind: 'text', placeholder: 'e.g. Rs.25,500 - Rs.81,100', hint: 'Khaali = "As per rules"' },
  qualification: { label: 'Qualification', kind: 'text', placeholder: 'e.g. Graduate' },
  age_text: { label: 'Age Limit', kind: 'text', placeholder: 'e.g. 18-32 years' },
  exam_date: { label: 'Exam Date', kind: 'text', placeholder: 'e.g. September 2026' },
  selection_process: { label: 'Selection Process', kind: 'text', placeholder: 'Written Exam -> Interview' },
  apply_link: { label: 'Official Apply / Download Link', kind: 'text', placeholder: 'https://...', hint: 'Khaali chhodoge to article se official link auto-nikalega' },
  category_id: { label: 'Category', kind: 'category' },
  state_id: { label: 'State', kind: 'state' },
  content: { label: 'Description / Details', kind: 'textarea' },
  question: { label: 'Question', kind: 'text' },
  answer: { label: 'Answer', kind: 'textarea' },
}
const FIELD_SETS: Record<string, string[]> = {
  job: ['title', 'department', 'total_posts', 'last_date', 'salary_text', 'qualification', 'age_text', 'exam_date', 'selection_process', 'apply_link', 'category_id', 'state_id', 'content'],
  admit_card: ['title', 'apply_link', 'content'],
  result: ['title', 'apply_link', 'content'],
  answer_key: ['title', 'apply_link', 'content'],
  current_affairs: ['title', 'question', 'answer'],
  news: ['title', 'content'],
}
const fieldsFor = (type: string) => FIELD_SETS[type] || ['title', 'content']

export default function AdminQueuePage() {
  const { colors } = useTheme()
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState({ text:'',type:'' })
  const [running, setRunning] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const showMsg = (text:string,type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),5000) }
  useEffect(()=>{
    fetchQueue()
    fetch('/api/categories').then(r=>r.json()).then(d=>setCategories(d.categories||[])).catch(()=>{})
    fetch('/api/states').then(r=>r.json()).then(d=>setStates(d.states||[])).catch(()=>{})
  },[])
  async function fetchQueue() { setLoading(true); const res=await fetch('/api/admin/queue?status=pending'); const data=await res.json(); setItems(data.items||[]); setSelected([]); setLoading(false) }
  async function runAutomation() { setRunning(true); showMsg('Automation chal rahi hai...'); const res=await fetch('/api/admin/run-automation',{method:'POST'}); const data=await res.json(); if(data.success) showMsg(`Done! ${data.fetched||0} items fetched.`); else showMsg('Error: '+(data.error||'Failed'),'error'); fetchQueue(); setRunning(false) }
  async function handleAction(id:string,action:'approve'|'reject') {
    const res=await fetch('/api/admin/queue',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,id})})
    const data=await res.json()
    if(data.success){ showMsg(data.message||'Done!'); fetchQueue(); return true }
    else { showMsg('Error: '+data.error,'error'); return false }
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

  // Open the editor for one item, pre-filled with what approve would publish
  // by default (server sends these as `item.suggested`).
  function startEdit(item:any) {
    if (editingId === item.id) { setEditingId(null); return }
    const d = item.data || {}
    const sg = item.suggested || {}
    const suggestedCat = categories.find(c => c.slug === sg.category_slug)?.id || ''
    setEditForm({
      title: d.title || item.title || '',
      department: d.department || sg.department || '',
      total_posts: d.total_posts || '',
      last_date: d.last_date ? String(d.last_date).slice(0, 10) : '',
      salary_text: d.salary_text || '',
      qualification: d.qualification || '',
      age_text: d.age_text || '',
      exam_date: d.exam_date || '',
      selection_process: d.selection_process || '',
      apply_link: d.apply_link || '',
      category_id: d.category_id || suggestedCat,
      state_id: d.state_id || '',
      content: d.content_edited ? (d.content || '') : (sg.content ?? d.content ?? ''),
      question: d.question || '',
      answer: d.answer_edited ? (d.answer || '') : (sg.answer ?? d.answer ?? ''),
    })
    setEditingId(item.id)
  }
  async function saveEdit(item:any, thenApprove:boolean) {
    setSaving(true)
    const fields: Record<string,string> = {}
    for (const k of fieldsFor(item.type)) fields[k] = editForm[k] ?? ''
    try {
      const res = await fetch('/api/admin/queue',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:item.id,fields})})
      const data = await res.json()
      if (!data.success) { showMsg('Error: '+(data.error||'Save nahi hua'),'error'); setSaving(false); return }
      if (thenApprove) {
        const ok = await handleAction(item.id,'approve')
        if (ok) setEditingId(null)
      } else {
        showMsg('Changes save ho gaye! Ab Approve kar sakte ho.')
        setEditingId(null)
        fetchQueue()
      }
    } catch (e:any) { showMsg('Error: '+e.message,'error') }
    setSaving(false)
  }

  const iS: React.CSSProperties = {width:'100%',padding:'9px 12px',background:colors.inputBg,border:`1px solid ${colors.cardBorder}`,borderRadius:8,color:colors.textPrimary,fontSize:13,outline:'none',boxSizing:'border-box'}
  const lS: React.CSSProperties = {display:'block',fontSize:10,color:colors.textMuted,fontWeight:600,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.08em'}
  const allSelected = items.length > 0 && selected.length === items.length

  function renderField(k:string) {
    const def = FIELD_DEFS[k]
    const val = editForm[k] ?? ''
    const set = (v:string) => setEditForm(f => ({...f,[k]:v}))
    const wide = def.kind === 'textarea' || k === 'title' || k === 'apply_link' || k === 'selection_process'
    let input
    if (def.kind === 'textarea') input = <textarea value={val} onChange={e=>set(e.target.value)} style={{...iS,height:130,resize:'vertical',fontFamily:'inherit',lineHeight:1.6}}/>
    else if (def.kind === 'category') input = <select value={val} onChange={e=>set(e.target.value)} style={{...iS,cursor:'pointer'}}><option value="">-- Auto-detect --</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
    else if (def.kind === 'state') input = <select value={val} onChange={e=>set(e.target.value)} style={{...iS,cursor:'pointer'}}><option value="">-- Select State --</option>{states.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
    else input = <input type={def.kind==='date'?'date':'text'} value={val} onChange={e=>set(e.target.value)} placeholder={def.placeholder} style={iS}/>
    return (
      <div key={k} style={{gridColumn:wide?'1 / -1':'auto'}}>
        <label style={lS}>{def.label}</label>
        {input}
        {def.hint && <div style={{fontSize:10,color:colors.textMuted,marginTop:3}}>{def.hint}</div>}
      </div>
    )
  }

  return (
    <div style={{padding:24}}>
      {msg.text&&<div style={{background:msg.type==='error'?'#ef444420':'#10b98120',border:`1px solid ${msg.type==='error'?'#ef444440':'#10b98140'}`,borderRadius:8,padding:'10px 16px',color:msg.type==='error'?'#ef4444':'#34d399',fontSize:13,marginBottom:16,fontWeight:600}}>{msg.text}</div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,flexWrap:'wrap',gap:12}}>
        <div><h1 style={{fontSize:20,fontWeight:900,color:colors.textPrimary,margin:0}}>Review Queue ({items.length})</h1><p style={{color:colors.textMuted,fontSize:12,marginTop:4}}>Auto-fetched items — Edit karke details sahi karo, phir approve ya reject karo. Approved items seedha publish honge.</p></div>
        <button onClick={runAutomation} disabled={running} style={{background:running?colors.cardBorder:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:8,padding:'10px 20px',color:running?colors.textMuted:'#fff',fontWeight:700,fontSize:13,cursor:running?'not-allowed':'pointer'}}>{running?'Running...':'▶ Run Automation Now'}</button>
      </div>

      {/* Bulk Action Bar */}
      {items.length > 0 && (
        <div style={{background:colors.cardBg,borderRadius:10,padding:'12px 16px',marginBottom:16,border:`1px solid ${colors.cardBorder}`,display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',color:colors.textSecondary,fontSize:13}}>
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
              <button onClick={clearAll} style={{background:'none',border:`1px solid ${colors.cardBorder}`,borderRadius:8,padding:'7px 12px',color:colors.textMuted,fontSize:12,cursor:'pointer'}}>Clear</button>
            </>
          )}
        </div>
      )}

      {loading?<div style={{textAlign:'center',color:colors.textMuted,padding:40}}>Loading...</div>:items.length===0?(
        <div style={{background:colors.cardBg,borderRadius:12,padding:48,textAlign:'center',border:`1px solid ${colors.cardBorder}`}}>
          <div style={{fontSize:48,marginBottom:12}}>✅</div>
          <p style={{color:colors.textMuted,fontSize:15,marginBottom:12}}>Queue empty hai!</p>
          <button onClick={runAutomation} style={{padding:'10px 24px',background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:8,color:'#000',fontWeight:700,cursor:'pointer'}}>Run Automation</button>
        </div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {items.map((item:any)=>(
            <div key={item.id} style={{background:colors.cardBg,borderRadius:12,padding:20,border:`1px solid ${editingId===item.id||selected.includes(item.id)?colors.accent:colors.cardBorder}`,transition:'border 0.15s'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
                <div style={{display:'flex',gap:12,flex:1}}>
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggleSelect(item.id)} style={{width:18,height:18,cursor:'pointer',flexShrink:0,marginTop:2}}/>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                      <span style={{background:'#f59e0b20',color:'#f59e0b',fontSize:10,padding:'2px 8px',borderRadius:4,fontWeight:700}}>{item.type?.toUpperCase()}</span>
                      {item.data?.admin_edited&&<span style={{background:'#3b82f620',color:'#3b82f6',fontSize:10,padding:'2px 8px',borderRadius:4,fontWeight:700}}>✏️ EDITED</span>}
                      <span style={{fontSize:11,color:colors.textMuted}}>{new Date(item.created_at).toLocaleDateString('en-IN')}</span>
                      {item.source_url&&<a href={item.source_url} target="_blank" rel="noreferrer" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>Source →</a>}
                    </div>
                    <h3 style={{fontSize:15,fontWeight:700,color:colors.textPrimary,marginBottom:8}}>{item.title||item.data?.title}</h3>
                    {item.suggested?.content&&<p style={{fontSize:12,color:colors.textSecondary,lineHeight:1.6,maxHeight:60,overflow:'hidden'}}>{String(item.data?.content_edited?item.data.content:item.suggested.content).slice(0,200)}...</p>}
                  </div>
                </div>
                <div style={{display:'flex',gap:10,flexShrink:0,flexWrap:'wrap'}}>
                  <button onClick={()=>startEdit(item)} style={{background:editingId===item.id?colors.accent:'#f59e0b22',border:'1px solid #f59e0b66',borderRadius:8,padding:'9px 18px',color:editingId===item.id?'#000':'#f59e0b',fontWeight:700,fontSize:12,cursor:'pointer'}}>{editingId===item.id?'✖ Close':'✏️ Edit'}</button>
                  <button onClick={()=>handleAction(item.id,'approve')} style={{background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:8,padding:'9px 18px',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>✅ Approve & Publish</button>
                  <button onClick={()=>handleAction(item.id,'reject')} style={{background:'#ef444420',border:'1px solid #ef444440',borderRadius:8,padding:'9px 18px',color:'#ef4444',fontWeight:700,fontSize:12,cursor:'pointer'}}>❌ Reject</button>
                </div>
              </div>

              {/* Inline editor — opens under the item */}
              {editingId===item.id&&(
                <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${colors.cardBorder}`}}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'12px 16px'}}>
                    {fieldsFor(item.type).map(renderField)}
                  </div>
                  <div style={{display:'flex',gap:10,marginTop:16,flexWrap:'wrap'}}>
                    <button onClick={()=>saveEdit(item,false)} disabled={saving} style={{background:`linear-gradient(135deg,${colors.accent},${colors.accentDark})`,border:'none',borderRadius:8,padding:'10px 22px',color:'#000',fontWeight:800,fontSize:13,cursor:saving?'not-allowed':'pointer',opacity:saving?0.6:1}}>{saving?'Saving...':'💾 Save'}</button>
                    <button onClick={()=>saveEdit(item,true)} disabled={saving} style={{background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:8,padding:'10px 22px',color:'#fff',fontWeight:800,fontSize:13,cursor:saving?'not-allowed':'pointer',opacity:saving?0.6:1}}>✅ Save & Approve</button>
                    <button onClick={()=>setEditingId(null)} disabled={saving} style={{background:'none',border:`1px solid ${colors.cardBorder}`,borderRadius:8,padding:'10px 18px',color:colors.textMuted,fontSize:13,cursor:'pointer'}}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
