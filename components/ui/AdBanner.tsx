'use client'
import { useEffect } from 'react'
import { useTheme } from './ThemeProvider'
type Props = { position: string; height?: number }

// While AdSense approval is still pending, real <ins> ad slots can reserve a
// large, unpredictable blank space (auto-format tries to fill available room
// with no ad to show). ADS_LIVE flips this to real Google ads once the site is
// approved and verified in the AdSense dashboard. Until then, Adsterra ads
// (below) show instead so the site still earns something meanwhile — flip
// this flag back to false any time to fall back to Adsterra again.
const ADS_LIVE = false

// Adsterra ad unit keys, from the sarkari-alert.com site added in the
// Adsterra publisher dashboard. Each `key` below maps to one specific ad
// unit created there — replace with new keys if units are ever recreated.
const ADSTERRA = {
  banner728x90: 'e1ec9835f9ed7973f465e787514d22c7',
  banner320x50: 'a8ab9d453bba4e6ea61051282590f77d',
  banner300x250: '17bb4d19af06ed0dc982bf2ce71f8423',
  nativeContainerId: 'container-3fab7226c908b2ddcfa9696ecaa333f0',
  nativeScriptSrc: 'https://pl31561707.profitableratecpmnetwork.com/3fab7226c908b2ddcfa9696ecaa333f0/invoke.js',
}

// Adsterra's "invoke.js" scripts read a global `atOptions` variable and then
// document.write an iframe into wherever they're loaded — which breaks (or
// throws console warnings) if done directly on the page in a React app,
// and would collide if two ad units tried to set the same global at once.
// Loading each one inside its own tiny iframe (via srcDoc) gives it an
// isolated, freshly-parsing document, which is exactly the environment
// document.write needs to work safely, and keeps every ad unit independent.
function AdsterraIframeBanner({ adKey, width, height }: { adKey: string; width: number; height: number }) {
  const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head><body>
<script>atOptions={key:'${adKey}',format:'iframe',height:${height},width:${width},params:{}};</script>
<script src="https://www.highrevenueformat.com/${adKey}/invoke.js"></script>
</body></html>`
  return (
    <iframe
      srcDoc={html}
      width={width}
      height={height}
      style={{ border: 'none', maxWidth: '100%' }}
      scrolling="no"
      title="Advertisement"
    />
  )
}

// The Native Banner unit works differently — it targets a specific container
// div by ID directly in the page's own DOM (no iframe/document.write), so it
// gets injected as a real script tag instead. It's cleaned up on unmount so
// navigating between pages doesn't pile up duplicate script tags.
function AdsterraNativeBanner() {
  useEffect(() => {
    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = ADSTERRA.nativeScriptSrc
    document.body.appendChild(script)
    return () => { script.remove() }
  }, [])
  return <div id={ADSTERRA.nativeContainerId} style={{ minHeight: 90, width: '100%' }} />
}

// Header/footer slots get a responsive pair: a wide 728x90 leaderboard on
// desktop, a 320x50 banner on mobile — swapped via a plain CSS media query
// so no JS/layout-shift is needed to pick the right one.
function AdsterraResponsiveBanner() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .adsterra-desktop-slot { display: block; }
        .adsterra-mobile-slot { display: none; }
        @media (max-width: 767px) {
          .adsterra-desktop-slot { display: none; }
          .adsterra-mobile-slot { display: block; }
        }
      ` }} />
      <div className="adsterra-desktop-slot"><AdsterraIframeBanner adKey={ADSTERRA.banner728x90} width={728} height={90} /></div>
      <div className="adsterra-mobile-slot"><AdsterraIframeBanner adKey={ADSTERRA.banner320x50} width={320} height={50} /></div>
    </>
  )
}

function AdsterraAd({ position }: { position: string }) {
  if (position === 'sidebar_top' || position === 'job_detail_top') {
    return <AdsterraIframeBanner adKey={ADSTERRA.banner300x250} width={300} height={250} />
  }
  if (position === 'between_jobs') {
    return <AdsterraIframeBanner adKey={ADSTERRA.banner320x50} width={320} height={50} />
  }
  if (position === 'job_detail_bottom') {
    return <AdsterraNativeBanner />
  }
  // header, footer, and any other/unrecognised position
  return <AdsterraResponsiveBanner />
}

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
    <div style={{ margin: '12px 0', display: 'flex', justifyContent: 'center' }}>
      <AdsterraAd position={position} />
    </div>
  )
}
