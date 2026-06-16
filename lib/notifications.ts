import { supabaseAdmin } from './supabase'

export async function sendTelegramAlert(job: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const channelId = process.env.TELEGRAM_CHANNEL_ID
  if (!token || !channelId) return
  const msg = `🔔 *NAYA JOB ALERT*\n\n📋 *${job.title}*\n🏛️ ${job.department}\n👥 Posts: ${job.total_posts}\n💰 Salary: ${job.salary_text}\n📅 Last Date: ${new Date(job.last_date).toLocaleDateString('en-IN')}\n\n👉 [Apply](${job.apply_link})\n🌐 [Details](${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.slug})\n\n#SarkariNaukri #GovtJob`
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: channelId, text: msg, parse_mode: 'Markdown' })
  }).catch(console.error)
}

export async function sendWhatsAppAlert(job: any) {
  // Using WhatsApp Business API / Twilio / Meta Cloud API
  const token = process.env.WHATSAPP_API_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID
  if (!token || !phoneId) return

  const { data: subscribers } = await supabaseAdmin
    .from('whatsapp_subscribers')
    .select('phone,categories,states')
    .eq('is_active', true)

  if (!subscribers?.length) return

  const matching = subscribers.filter(s => {
    const catMatch = !s.categories?.length || s.categories.includes(job.category || '')
    const stateMatch = !s.states?.length || s.states.includes('All India') || s.states.includes(job.state || '')
    return catMatch || stateMatch
  })

  const msg = `🔔 *New Sarkari Job Alert!*\n\n*${job.title}*\n📋 Posts: ${job.total_posts}\n💰 ${job.salary_text}\n📅 Last Date: ${new Date(job.last_date).toLocaleDateString('en-IN')}\n\nApply: ${job.apply_link}\nDetails: ${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.slug}`

  for (const sub of matching) {
    await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp', to: sub.phone,
        type: 'text', text: { body: msg }
      })
    }).catch(console.error)
    await new Promise(r => setTimeout(r, 100))
  }
}

export async function sendEmailAlerts(job: any) {
  const { data: alerts } = await supabaseAdmin.from('alerts').select('email,categories,states').eq('is_active', true)
  if (!alerts?.length) return

  const matching = alerts.filter(a => {
    const catMatch = !a.categories?.length || a.categories.includes(job.category || '')
    const stateMatch = !a.states?.length || a.states.includes('All India') || a.states.includes(job.state || '')
    return catMatch || stateMatch
  })
  if (!matching.length) return

  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })

  const html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#fff;padding:0;border-radius:12px;overflow:hidden;"><div style="background:#f59e0b;padding:16px 24px;"><h1 style="margin:0;color:#000;font-size:18px;">🔔 New Job Alert — SarkariAlert</h1></div><div style="padding:24px;"><h2 style="color:#f59e0b;margin:0 0 8px;">${job.title}</h2><p style="color:#94a3b8;margin:0 0 20px;">${job.department}</p><table style="width:100%;border-collapse:collapse;"><tr><td style="padding:10px;background:#1e293b;color:#94a3b8;">Total Posts</td><td style="padding:10px;background:#1e293b;color:#fff;">${job.total_posts}</td></tr><tr><td style="padding:10px;color:#94a3b8;">Salary</td><td style="padding:10px;color:#fff;">${job.salary_text}</td></tr><tr><td style="padding:10px;background:#1e293b;color:#94a3b8;">Last Date</td><td style="padding:10px;background:#1e293b;color:#ef4444;font-weight:700;">${new Date(job.last_date).toLocaleDateString('en-IN')}</td></tr></table><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.slug}" style="display:block;text-align:center;background:#f59e0b;color:#000;padding:14px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:20px;">View & Apply Now →</a></div></div>`

  for (let i = 0; i < matching.length; i += 50) {
    const batch = matching.slice(i, i + 50)
    await Promise.allSettled(batch.map(a => transporter.sendMail({
      from: `SarkariAlert <${process.env.FROM_EMAIL}>`,
      to: a.email,
      subject: `🔔 ${job.title} — ${job.total_posts} Posts`,
      html
    })))
  }
}

export async function sendPushNotification(title: string, body: string, url: string) {
  const webpush = await import('web-push')
  webpush.default.setVapidDetails(`mailto:${process.env.SMTP_USER}`, process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!)
  const { data: alerts } = await supabaseAdmin.from('alerts').select('push_subscription').eq('is_active', true).not('push_subscription', 'is', null)
  if (!alerts?.length) return
  const payload = JSON.stringify({ title, body, icon: '/icons/icon-192.png', url })
  await Promise.allSettled(alerts.map(a => webpush.default.sendNotification(a.push_subscription, payload).catch(console.error)))
}
