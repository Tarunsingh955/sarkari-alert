# SarkariAlert V2 — Complete Setup Guide

## STEP 1: Next.js Project Create Karo

```bash
npx create-next-app@latest sarkari-alert --typescript --app --no-tailwind --no-src-dir
cd sarkari-alert
npm install @supabase/supabase-js @supabase/ssr jose bcryptjs nodemailer razorpay zod slugify rss-parser web-push
npm install -D @types/bcryptjs @types/nodemailer @types/web-push
```

## STEP 2: Supabase Setup

1. supabase.com → New Project → "sarkari-alert"
2. SQL Editor → supabase/schema-v2.sql ka content paste karein → Run
3. Settings → API → URL + anon key + service_role key copy karein

## STEP 3: Files Copy Karo

```
sarkari-v2/          → apne Next.js project mein
  supabase/          → reference ke liye rakh lo
  lib/               → lib/
  app/               → app/
  components/        → components/
  public/            → public/
  middleware.ts      → middleware.ts
  next.config.ts     → next.config.ts
  tsconfig.json      → tsconfig.json
  vercel.json        → vercel.json
```

## STEP 4: IMPORTANT — Folder Rename

```
app/jobs/slug/   →   app/jobs/[slug]/
```
Ye rename karna zaroori hai!

## STEP 5: .env.local Banao

.env.example copy karke .env.local banao aur sab values bharo.

## STEP 6: First Admin User

Supabase SQL Editor mein:
```sql
INSERT INTO users (name, email, password, role)
VALUES (
  'Admin',
  'admin@sarkari-alert.in',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpR4DaXAGHOw6m',
  'super_admin'
);
-- Password: Admin@2025
```

## STEP 7: Local Test

```bash
npm run dev
```
- Website: http://localhost:3000
- Admin: http://localhost:3000/admin
- Login: admin@sarkari-alert.in / Admin@2025

## STEP 8: Vercel Deploy

```bash
git init
git add .
git commit -m "SarkariAlert V2"
git push origin main
```
Vercel → Import → Add env variables → Deploy

## STEP 9: Cron Job Setup

vercel.json mein CRON_SECRET_HERE apne CRON_SECRET se replace karo.

## STEP 10: Razorpay Setup

1. razorpay.com → Test mode mein keys lo
2. .env.local mein add karo
3. Live mode ke liye KYC karo

## STEP 11: WhatsApp Business API

1. Meta Developer Console → Create App → WhatsApp
2. Phone Number ID + Token copy karo
3. .env.local mein add karo

## STEP 12: Telegram Bot

1. @BotFather → /newbot
2. Channel banao → Bot ko admin karo
3. Token + Channel ID .env.local mein

## Revenue Timeline

Month 1  (500/day):   Rs.1,000 - Rs.5,000
Month 3  (2000/day):  Rs.10,000 - Rs.30,000
Month 6  (10000/day): Rs.50,000 - Rs.1,50,000
Month 12+:            Rs.2,00,000+

## Revenue Sources

- Google AdSense (main)
- Resume Downloads @ Rs.10
- Premium Monthly @ Rs.49
- Premium Yearly @ Rs.199
- Sponsored Jobs @ Rs.199/499/999

## Features Checklist

✅ Complete Supabase Schema (30+ tables)
✅ JWT Auth + bcrypt passwords
✅ Rate Limiting + Security Headers
✅ Admin Panel (10+ pages)
✅ Job CRUD with notifications
✅ WhatsApp Alerts (Meta API)
✅ Telegram Alerts
✅ Email Alerts (SMTP)
✅ Push Notifications (VAPID)
✅ Razorpay Payments
✅ Premium Membership (Rs.49/199)
✅ Resume Builder (Rs.10/download)
✅ Previous Year Papers
✅ Auto-fetch RSS + Queue
✅ SEO (sitemap, robots, schemas)
✅ PWA (offline, install, push)
✅ Analytics Dashboard
✅ WhatsApp Broadcast
✅ Advertise With Us
✅ Sponsored Jobs
✅ Admin Login Logs
✅ Auto-disable expired jobs
