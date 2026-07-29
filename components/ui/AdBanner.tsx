'use client'
import { useEffect, useState } from 'react'
type Props = { position: string; height?: number }

const ADS_LIVE = false

export default function AdBanner({ position, height = 90 }: Props) {
  useEffect(() => {
    if (!ADS_LIVE) return
    try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}) } catch {}
  }, [])

  if (ADS_LIVE && process.env.NEXT_PUBLIC_ADSENSE_ID) {
    return (
      <div style={{margin:'12px 0'}}>
        <ins className="adsbygoogle" style={{display:'block',height}} data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID} data-ad-slot={position} data-ad-format="auto" data-full-width-responsive="true"/>
      </div>
    )
  }
  return (
    <div style={{background:'#1e293b',border:'1px dashed #334155',borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'12px 0',height,color:'#334155',textAlign:'center',gap:4}}>
      <div style={{fontSize:12,fontWeight:600,color:'#475569'}}>Advertisement</div>
      <div style={{fontSize:10,color:'#334155'}}>Google AdSense — {position}</div>
    </div>
  )
}