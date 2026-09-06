'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'
export default function AdminWhatsAppPage() {
  const { colors } = useTheme()
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState({ text:'',type:'' })
  const showMsg = (text:string,type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),4000) }
  useEffect(()=>{ fetch('/api/admin/whatsapp').then(r=>r.json()).then(d=>{ setSubscribers(d.subscribers||[]); setLoading(false) }) },[])
  async function broadcast() {
    if(!message.trim()){ showMsg('Message likhein!','error'); return }
    setSending(true)
    const res=await fetch('/api/admin/whatsapp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})})
    const data=await res.json()
    if(data.success){ showMsg(`Broadcast sent! ${data.sent}/${data.total} subscribers ko message gaya.`); setMessage('') }
    else showMsg('Error: '+data.error,'error')
    setSending(false)
  }
  return (
    <div style={{padding:24}}>
      {msg.text&&<div style={{background:msg.type==='error'?'#ef444420':'#10b98120',border:`1px solid ${msg.type==='error'?'#ef444440':'#10b98140'}`,borderRadius:8,padding:'10px 16px',color:msg.type==='error'?'#ef4444':'#34d399',fontSize:13,marginBottom:16,fontWeight:600}}>{msg.text}</div>}
      <h1 style={{fontSize:20,fontWeight:900,color:colors.textPrimary,marginBottom:20}}>💬 WhatsApp Subscribers ({subscribers.length})</h1>
      {/* Broadcast */}
      <div style={{background:colors.cardBg,borderRadius:14,padding:20,marginBottom:20,border: `1px solid ${colors.cardBorder}`}}>
        <h2 style={{color:'#10b981',fontSize:15,fontWeight:800,marginBottom:14}}>📢 Broadcast Message</h2>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Sab subscribers ko message likhein..." style={{width:'100%',padding:'12px 16px',background:colors.inputBg,border: `1px solid ${colors.cardBorder}`,borderRadius:8,color:'#fff',fontSize:13,outline:'none',boxSizing:'border-box',height:100,resize:'vertical',marginBottom:12}}/>
        <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          <button onClick={broadcast} disabled={sending} style={{padding:'10px 24px',background:sending?colors.cardBorder:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:8,color:sending?colors.textMuted:'#fff',fontWeight:700,fontSize:13,cursor:sending?'not-allowed':'pointer'}}>{sending?'Sending...':'📤 Send to All Subscribers'}</button>
          <span style={{fontSize:12,color:colors.textMuted}}>{subscribers.filter((s:any)=>s.is_active).length} active subscribers</span>
        </div>
      </div>
      {/* Subscriber List */}
      {loading?<div style={{textAlign:'center',color:colors.textMuted,padding:40}}>Loading...</div>:(
        <div style={{background:colors.cardBg,borderRadius:14,border: `1px solid ${colors.cardBorder}`,overflow:'hidden'}}>
          <div style={{padding:'14px 16px',borderBottom: `1px solid ${colors.cardBorder}`,display:'flex',justifyContent:'space-between'}}>
            <span style={{color:colors.textPrimary,fontWeight:700,fontSize:14}}>Subscriber List</span>
            <span style={{color:colors.textMuted,fontSize:13}}>{subscribers.filter((s:any)=>s.is_active).length} active</span>
          </div>
          <div style={{maxHeight:500,overflowY:'auto'}}>
            {subscribers.map((s:any)=>(
              <div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',borderBottom: `1px solid ${colors.bg}`}}>
                <div>
                  <div style={{color:colors.textPrimary,fontSize:13,fontWeight:600}}>{s.phone}</div>
                  {s.name&&<div style={{color:colors.textSecondary,fontSize:11}}>{s.name}</div>}
                  <div style={{color:colors.textMuted,fontSize:11,marginTop:2}}>{new Date(s.created_at).toLocaleDateString('en-IN')}</div>
                </div>
                <span style={{background:s.is_active?'#10b98120':'#33415520',color:s.is_active?'#10b981':colors.textMuted,fontSize:11,padding:'2px 8px',borderRadius:20,fontWeight:700}}>{s.is_active?'Active':'Inactive'}</span>
              </div>
            ))}
            {!subscribers.length&&<div style={{textAlign:'center',padding:32,color:colors.textMuted}}>Koi subscriber nahi hai abhi.</div>}
          </div>
        </div>
      )}
    </div>
  )
}
