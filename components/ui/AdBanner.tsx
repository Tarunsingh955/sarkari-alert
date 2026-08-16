'use client'
import { useEffect } from 'react'
import { useTheme } from './ThemeProvider'
type Props = { position: string; height?: number }

// While AdSense approval is still pending, real <ins> ad slots can reserve a
// large, unpredictable blank space (auto-format tries to fill available room
// with no ad to show). ADS_LIVE flips this to real ads once the site is
// approved and verified in the AdSense dashboard — until then it shows a
// fixed-size, theme-aware placeholder instead.
const ADS_LIVE = false

export default function AdBanner({ position, height = 90 }: Props) {
  const { colors } = useTheme()

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
    <div style={{background:colors.cardBg,border:`1px dashed ${colors.cardBorder}`,borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'12px 0',height,color:colors.textMuted,textAlign:'center',gap:4,boxShadow:`0 1px 3px ${colors.cardShadow}`}}>
      <div style={{fontSize:12,fontWeight:600,color:colors.textSecondary}}>Advertisement</div>
      <div style={{fontSize:10,color:colors.textMuted}}>Google AdSense — {position}</div>
    </div>
  )
}
