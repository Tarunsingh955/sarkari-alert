'use client'
import { useState } from 'react'
import { useTheme } from './ThemeProvider'
const CAT_COLORS: Record<string,string> = {central:'#f59e0b',state:'#10b981',railway:'#3b82f6',banking:'#8b5cf6',teaching:'#ec4899',defence:'#ef4444',ssc:'#f97316',upsc:'#06b6d4',psc:'#84cc16'}
const CAT_ICONS: Record<string,string> = {central:'🏛️',state:'🏢',railway:'🚂',banking:'🏦',teaching:'📚',defence:'⚔️',ssc:'📋',upsc:'🎯',psc:'🏛️'}
function daysLeft(d:string){return Math.ceil((new Date(d).getTime()-Date.now())/86400000)}
function fmtSalary(min:number,max:number,text:string){if(text)return text;if(!min&&!max)return 'As per rules';return `Rs.${min.toLocaleString('en-IN')} - Rs.${max.toLocaleString('en-IN')}`}
export default function JobCard({job}:{job:any}) {
  const { colors } = useTheme()
  const [hover,setHover]=useState(false)
  const days=daysLeft(job.last_date)
  const urgent=days<=7&&days>0
  const catSlug=job.categories?.slug||job.category_id||'central'
  const catColor=CAT_COLORS[catSlug]||'#6b7280'
  const catIcon=CAT_ICONS[catSlug]||'🏛️'
  return (
    <a href={`/jobs/${job.slug}`} style={{textDecoration:'none',display:'block'}}>
      <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{background:colors.cardBg,borderRadius:12,padding:16,border:`1px solid ${hover?colors.accent+'60':urgent?'#ef444440':colors.cardBorder}`,position:'relative',overflow:'hidden',cursor:'pointer',transition:'all 0.2s',transform:hover?'translateY(-2px)':'none',boxShadow:hover?`0 8px 24px ${colors.cardShadow}`:`0 1px 3px ${colors.cardShadow}`}}>
        {job.is_new&&<div style={{position:'absolute',top:10,right:10,background:'#10b981',color:'#fff',fontSize:9,padding:'2px 8px',borderRadius:20,fontWeight:700}}>NEW</div>}
        {job.is_hot&&<div style={{position:'absolute',top:job.is_new?30:10,right:10,background:'#ef4444',color:'#fff',fontSize:9,padding:'2px 8px',borderRadius:20,fontWeight:700}}>🔥 HOT</div>}
        {job.is_sponsored&&<div style={{position:'absolute',top:10,left:10,background:'#8b5cf6',color:'#fff',fontSize:9,padding:'2px 8px',borderRadius:20,fontWeight:700}}>SPONSORED</div>}
        <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
          <div style={{width:46,height:46,borderRadius:10,flexShrink:0,background:catColor+'22',border:`1px solid ${catColor}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{catIcon}</div>
          <div style={{flex:1,minWidth:0}}>
            <h3 style={{fontSize:15,fontWeight:700,color:colors.textPrimary,marginBottom:4,lineHeight:1.3}}>{job.title}</h3>
            <p style={{fontSize:12,color:colors.textSecondary,marginBottom:8}}>{job.department}</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
              <span style={{background:catColor+'22',color:catColor,fontSize:11,padding:'2px 8px',borderRadius:20,fontWeight:600}}>{job.categories?.name||'Govt'}</span>
              <span style={{background:'#1e40af22',color:'#60a5fa',fontSize:11,padding:'2px 8px',borderRadius:20}}>Posts: {job.total_posts}</span>
              <span style={{background:'#05966922',color:'#34d399',fontSize:11,padding:'2px 8px',borderRadius:20}}>{fmtSalary(job.salary_min,job.salary_max,job.salary_text)}</span>
              {job.states?.name&&<span style={{background:colors.cardBorder+'80',color:colors.textSecondary,fontSize:11,padding:'2px 8px',borderRadius:20}}>{job.states.name}</span>}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
              <div style={{fontSize:12}}>
                <span style={{color:colors.textSecondary}}>Last Date: </span>
                <span style={{color:urgent?'#ef4444':colors.accent,fontWeight:600}}>{new Date(job.last_date).toLocaleDateString('en-IN')}</span>
                {days>0&&<span style={{color:urgent?'#ef4444':colors.textMuted,fontSize:11}}> ({days} din bache)</span>}
                {days<=0&&<span style={{color:'#ef4444',fontWeight:700}}> CLOSED</span>}
              </div>
              <span style={{background:`linear-gradient(135deg,${colors.accent},${colors.accentDark})`,borderRadius:8,padding:'5px 14px',color:'#000',fontWeight:700,fontSize:11}}>{job.notify_text||'Apply →'}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}
