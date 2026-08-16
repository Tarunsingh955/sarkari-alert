'use client'
import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'
const NAV = [{href:'/',label:'Home'},{href:'/jobs',label:'Sarkari Jobs'},{href:'/admit-card',label:'Admit Card'},{href:'/result',label:'Result'},{href:'/previous-papers',label:'Papers'},{href:'/news',label:'News'},{href:'/current-affairs',label:'Current Affairs'},{href:'/resume',label:'Resume'}]
const FALLBACK_ITEMS = ["SSC CGL 2025 - 17727 Posts", "Railway NTPC 11558 Posts", "UP Police 60244 Posts", "Bihar Police 21391 Posts", "SBI Clerk 13735 Posts"]

export default function Header() {
  const { colors, themeName, toggleTheme } = useTheme()
  const [menuOpen,setMenuOpen]=useState(false)
  const [tickerItems, setTickerItems] = useState<string[]>(FALLBACK_ITEMS)

  useEffect(() => {
    let cancelled = false
    async function loadTicker() {
      try {
        const [jobsRes, msgRes] = await Promise.all([
          fetch('/api/jobs?sort=newest&limit=5'),
          fetch('/api/ticker').catch(() => null),
        ])
        const jobsData = await jobsRes.json()
        const jobs = jobsData.jobs || []
        const jobItems = jobs.map((j: any) => `${j.title} - ${j.total_posts || 'Multiple'} Posts`)

        let customItems: string[] = []
        if (msgRes && msgRes.ok) {
          const msgData = await msgRes.json()
          customItems = (msgData.messages || []).map((m: any) => m.message)
        }

        const combined = [...customItems, ...jobItems]
        if (combined.length && !cancelled) setTickerItems(combined)
      } catch {
      }
    }
    loadTicker()
    return () => { cancelled = true }
  }, [])

  const renderItems = [...tickerItems, ...tickerItems]

  return (
    <header style={{background:colors.bg,borderBottom:`2px solid ${colors.accent}`,position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 20px rgba(0,0,0,0.5)'}}>
      <div style={{background:colors.accent,padding:'3px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',overflow:'hidden'}}>
        <div className="ticker-viewport" style={{flex:1,overflow:'hidden',position:'relative'}}>
          <div className="ticker-track" style={{display:'flex',whiteSpace:'nowrap',width:'max-content',alignItems:'center'}}>
            <span style={{fontSize:12,color:'#000',fontWeight:800,paddingRight:10,flexShrink:0}}>BREAKING:</span>
            {renderItems.map((item, idx) => (
              <span key={idx} style={{display:'flex',alignItems:'center',flexShrink:0}}>
                <span style={{fontSize:12,color:'#000',fontWeight:600,paddingRight:28}}>{item}</span>
                <span style={{width:6,height:6,borderRadius:'50%',background:'#000',opacity:0.4,marginRight:28,flexShrink:0}} />
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{background:'rgba(0,0,0,0.2)',border:'1px solid rgba(0,0,0,0.3)',padding:'2px 10px',borderRadius:4,fontSize:13,cursor:'pointer',marginLeft:12,flexShrink:0,lineHeight:1.6}}
        >
          {themeName === 'dark' ? '☀️' : '🌙'}
        </button>
        <a href="/admin" style={{background:'rgba(0,0,0,0.2)',border:'1px solid rgba(0,0,0,0.3)',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:700,textDecoration:'none',color:'#000',marginLeft:8,flexShrink:0}}>Admin</a>
      </div>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 16px',display:'flex',alignItems:'center',justifyContent:'space-between',height:56}}>
        <a href="/" style={{textDecoration:'none',flexShrink:0}}>
          <div style={{fontSize:20,fontWeight:900,color:colors.accent,lineHeight:1}}>SarkariAlert</div>
          <div style={{fontSize:9,color:colors.textMuted,letterSpacing:'0.12em'}}>INDIA #1 GOVT JOB PORTAL</div>
        </a>
        <nav style={{display:'flex',gap:2,flexWrap:'wrap'}} className="desktop-nav">
          {NAV.map(item=><a key={item.href} href={item.href} style={{padding:'6px 10px',borderRadius:6,color:colors.textSecondary,fontWeight:500,fontSize:11,textDecoration:'none'}} onMouseEnter={e=>(e.currentTarget.style.color=colors.accent)} onMouseLeave={e=>(e.currentTarget.style.color=colors.textSecondary)}>{item.label}</a>)}
        </nav>
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{display:'none',background:'none',border:'none',color:colors.textPrimary,fontSize:22,cursor:'pointer'}} className="mob-btn">☰</button>
      </div>
      {menuOpen&&<div style={{background:colors.cardBg,borderTop:`1px solid ${colors.cardBorder}`}}>{NAV.map(item=><a key={item.href} href={item.href} style={{display:'block',padding:'12px 20px',color:colors.textSecondary,fontSize:14,textDecoration:'none',borderBottom:`1px solid ${colors.bg}`}}>{item.label}</a>)}</div>}
      <style>{`
        @media(max-width:900px){.desktop-nav{display:none!important;}.mob-btn{display:block!important;}}
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
        }
        .ticker-viewport:hover .ticker-track {
          animation-play-state: paused;
        }
      `}</style>
    </header>
  )
}
