'use client'
import { useState } from 'react'
import Script from 'next/script'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

const PLANS = [
  { type: 'premium_monthly', name: 'Monthly', price: 49, period: '/month', highlight: false },
  { type: 'premium_yearly', name: 'Yearly', price: 199, period: '/year', highlight: true },
]

const FEATURES = [
  'Premium Resume Templates (Modern & Elegant designs)',
  'Photo, Certifications, Projects & Languages sections in Resume',
  'No watermark on downloaded Resume',
  'Access to Premium Previous Year Papers',
  'Priority Job Alerts',
]

export default function MembershipPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const showMsg = (text: string, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 5000) }

  async function handleBuy(type: string) {
    setLoading(type)
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      const order = await res.json()
      if (order.error) { showMsg('Error: ' + order.error, 'error'); setLoading(null); return }

      const options = {
        key: order.keyId,
        amount: order.amount * 100,
        currency: order.currency,
        name: 'SarkariAlert',
        description: type === 'premium_monthly' ? 'Premium Monthly Plan' : 'Premium Yearly Plan',
        order_id: order.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              type,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            showMsg('Payment successful! Aapka account Premium ho gaya hai 🎉')
            setTimeout(() => window.location.reload(), 2000)
          } else {
            showMsg('Payment verification failed: ' + (verifyData.error || 'Unknown error'), 'error')
          }
        },
        theme: { color: '#f59e0b' },
        modal: { ondismiss: () => setLoading(null) },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (e: any) {
      showMsg('Error: ' + e.message, 'error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 }}>⭐ SarkariAlert Premium</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Apni job preparation ko next level pe le jaayein</p>
        </div>

        {msg.text && (
          <div style={{ background: msg.type === 'error' ? '#ef444420' : '#10b98120', border: `1px solid ${msg.type === 'error' ? '#ef444440' : '#10b98140'}`, borderRadius: 8, padding: '10px 16px', color: msg.type === 'error' ? '#ef4444' : '#34d399', fontSize: 13, marginBottom: 20, textAlign: 'center', fontWeight: 600 }}>{msg.text}</div>
        )}

        <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155', marginBottom: 24 }}>
          <h3 style={{ color: '#f59e0b', fontSize: 14, marginBottom: 12 }}>Premium mein kya milta hai:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#cbd5e1' }}>
                <span style={{ color: '#10b981', flexShrink: 0 }}>✅</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {PLANS.map(plan => (
            <div key={plan.type} style={{
              background: '#1e293b', borderRadius: 14, padding: 24, textAlign: 'center',
              border: plan.highlight ? '2px solid #f59e0b' : '1px solid #334155',
              position: 'relative',
            }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#000', fontSize: 11, fontWeight: 800, padding: '3px 14px', borderRadius: 20 }}>BEST VALUE</div>
              )}
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#f59e0b' }}>₹{plan.price}<span style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}>{plan.period}</span></div>
              <button
                onClick={() => handleBuy(plan.type)}
                disabled={loading === plan.type}
                style={{
                  marginTop: 16, width: '100%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 8,
                  padding: '12px 20px', color: '#000', fontWeight: 800, fontSize: 14, cursor: loading === plan.type ? 'default' : 'pointer',
                  opacity: loading === plan.type ? 0.6 : 1,
                }}
              >
                {loading === plan.type ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 20 }}>Secure payment powered by Razorpay. Login zaroori hai payment se pehle.</p>
      </main>
      <Footer />
    </div>
  )
}
