# 📧 Daily Stats Email — Setup Guide

A Vercel-cron-driven daily email report for parifoot.online visitor analytics.
Runs at **08:00 Cameroon time (07:00 UTC)** every day, pulls stats from Supabase,
renders a brand-themed HTML email, and sends via Resend.

## What was built

| File | Purpose |
|---|---|
| `src/lib/daily-stats.ts` | Pulls aggregated visitor data from Supabase |
| `src/lib/daily-stats-email.ts` | Renders dark-themed HTML + plain-text email |
| `src/app/api/cron/daily-stats/route.ts` | API route that triggers send |
| `vercel.json` | Cron schedule (`0 7 * * *` UTC = 8:00 AM Cameroon) |
| `package.json` | Resend SDK installed (`resend@^6.x`) |

## Deploy checklist (one-time, ~5 minutes)

### Step 1 — Create a Resend account (free, 3000 emails/month)
1. Go to **https://resend.com**
2. Sign up with **sircarinocompany@gmail.com**
3. Verify your email
4. **Dashboard → API Keys → Create API Key** → name it `parifoot-daily-stats`
5. Copy the key (starts with `re_`)

### Step 2 — Add the API key to Vercel env vars
1. Open the parifoot project in Vercel dashboard
2. **Settings → Environment Variables**
3. Add these three:

| Name | Value | Environment |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxxx...` (from step 1) | Production |
| `DAILY_REPORT_TO` | `sircarinocompany@gmail.com` | Production |
| `CRON_SECRET` | Run `openssl rand -hex 32` and paste the output | Production |

### Step 3 — (Optional) Verify your sending domain
- By default the email is sent from `Parifoot Reports <onboarding@resend.dev>` (Resend's shared sender)
- This works immediately but mail may land in spam/promotions
- To send from `reports@parifoot.online`:
  1. Resend dashboard → **Domains → Add Domain → parifoot.online**
  2. Add the DNS records Resend gives you (in your domain registrar)
  3. Wait for verification (usually < 5 min)
  4. Add a 4th env var to Vercel: `DAILY_REPORT_FROM=Parifoot Reports <reports@parifoot.online>`

### Step 4 — Deploy
1. Commit and push to main: `git add . && git commit -m "feat: daily stats email cron" && git push`
2. Vercel auto-deploys
3. Vercel detects `vercel.json` and registers the cron schedule
4. **Verify cron is registered:** Vercel dashboard → **Crons** tab → should show `/api/cron/daily-stats` at `0 7 * * *`

### Step 5 — Test it manually (without waiting for 8 AM)
After deploy, hit this URL once to send a test email immediately:

```
https://www.parifoot.online/api/cron/daily-stats?key=YOUR_CRON_SECRET
```

Replace `YOUR_CRON_SECRET` with the value you set in step 2. Should return:

```json
{
  "ok": true,
  "sent_to": "sircarinocompany@gmail.com",
  "subject": "📊 Parifoot Daily — 103 visits yesterday (320 total)",
  "stats_summary": { ... },
  "resend_id": "..."
}
```

Check sircarinocompany@gmail.com — the email should arrive within seconds.

## Schedule reference

| Cron | UTC | Cameroon (UTC+1) | When |
|---|---|---|---|
| `0 7 * * *` (current) | 07:00 | **08:00** | Every morning |
| `0 6 * * *` | 06:00 | 07:00 | Earlier morning |
| `0 21 * * *` | 21:00 | 22:00 | Bedtime recap |
| `0 7,21 * * *` | 07:00 + 21:00 | 08:00 + 22:00 | Twice a day |

To change: edit `vercel.json` and redeploy.

## What the email contains

- **Headline KPIs** — yesterday's visits + day-over-day delta, all-time total, last 7d, last 30d, today so far
- **Daily trend** — bar chart of last 14 days
- **Top countries** — with flag emojis and percentage share
- **Top pages** — which URLs are pulling traffic
- **Top referrers** — direct vs google vs other
- **Devices** — mobile/desktop split
- **UTM campaigns** — tagged campaign performance (currently empty until you add UTMs)

Brand-styled in NARCOFRAMES dark mode (`#0a0a0f` background, `#ef4444` red accents, Inter font).

## Troubleshooting

**Email lands in spam/promotions on Gmail**
- Mark "not spam" once, then add `onboarding@resend.dev` to contacts
- Long-term fix: complete step 3 (verify your own domain)

**Cron doesn't fire**
- Check Vercel dashboard → Crons tab — the job should be listed and have a "last run" timestamp
- If missing: confirm `vercel.json` is at the project root and was deployed
- Vercel cron requires the Pro plan for crons that run more than once a day (single daily cron works on free tier)

**Returns 401 Unauthorized**
- Either `CRON_SECRET` env var isn't set in Vercel, OR the cron isn't passing the right header
- For manual testing, append `?key=YOUR_CRON_SECRET` to the URL

**Returns 500 RESEND_API_KEY not set**
- Add `RESEND_API_KEY` to Vercel env vars and redeploy

**Returns 500 DAILY_REPORT_TO not set**
- Add `DAILY_REPORT_TO=sircarinocompany@gmail.com` to Vercel env vars and redeploy

## Stopping the daily reports

Two options:
1. **Pause cron temporarily:** Vercel dashboard → Crons → toggle off the job
2. **Permanent removal:** delete `vercel.json` (or remove the `crons` array) and redeploy
