'use client'
import { useState } from 'react'
const NAV = [{href:'/',label:'Home'},{href:'/jobs',label:'Sarkari Jobs'},{href:'/admit-card',label:'Admit Card'},{href:'/result',label:'Result'},{href:'/previous-papers',label:'Papers'},{href:'/news',label:'News'},{href:'/current-affairs',label:'Current Affairs'},{href:'/resume',label:'Resume'}]
export default function Header() {
  const [menuOpen,setMenuOpen]=useState(false)
  return (
    <header style={{background:'#0f172a',borderBottom:'2px solid #f59e0b',position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 20px rgba(0,0,0,0.5)'}}>
      <div style={{background:'#f59e0b',padding:'3px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',overflow:'hidden'}}>
        <div style={{flex:1,overflow:'hidden'}}><marquee style={{fontSize:12,color:'#000',fontWeight:600}}>🔴 BREAKING: SSC CGL 2025 — 17727 Posts | Railway NTPC 11558 Posts | UP Police 60244 Posts | Bihar Police 21391 Posts | SBI Clerk 13735 Posts</marquee></div>
        <a href="/admin" style={{background:'rgba(0,0,0,0.2)',border:'1px solid rgba(0,0,0,0.3)',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:700,textDecoration:'none',color:'#000',marginLeft:12,flexShrink:0}}>Admin</a>
      </div>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 16px',display:'flex',alignItems:'center',justifyContent:'space-between',height:56}}>
        <a href="/" style={{textDecoration:'none',flexShrink:0}}>
          <div style={{fontSize:20,fontWeight:900,color:'#f59e0b',lineHeight:1}}>SarkariAlert</div>
          <div style={{fontSize:9,color:'#64748b',letterSpacing:'0.12em'}}>INDIA #1 GOVT JOB PORTAL</div>
        </a>
        <nav style={{display:'flex',gap:2,flexWrap:'wrap'}} className="desktop-nav">
          {NAV.map(item=><a key={item.href} href={item.href} style={{padding:'6px 10px',borderRadius:6,color:'#94a3b8',fontWeight:500,fontSize:11,textDecoration:'none'}} onMouseEnter={e=>(e.currentTarget.style.color='#f59e0b')} onMouseLeave={e=>(e.currentTarget.style.color='#94a3b8')}>{item.label}</a>)}
        </nav>
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{display:'none',background:'none',border:'none',color:'#fff',fontSize:22,cursor:'pointer'}} className="mob-btn">☰</button>
      </div>
      {menuOpen&&<div style={{background:'#1e293b',borderTop:'1px solid #334155'}}>{NAV.map(item=><a key={item.href} href={item.href} style={{display:'block',padding:'12px 20px',color:'#94a3b8',fontSize:14,textDecoration:'none',borderBottom:'1px solid #0f172a'}}>{item.label}</a>)}</div>}
      <style>{`@media(max-width:900px){.desktop-nav{display:none!important;}.mob-btn{display:block!important;}}`}</style>
    </header>
  )
}
