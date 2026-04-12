-- Run this in Supabase Dashboard → SQL Editor
-- Creates the visitors table for tracking unique daily visitors

CREATE TABLE IF NOT EXISTS visitors (
  id BIGSERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  country TEXT,
  city TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  page TEXT NOT NULL,
  user_agent TEXT,
  device TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique visitor per day (same IP = 1 record per day)
CREATE UNIQUE INDEX IF NOT EXISTS idx_visitors_ip_date
  ON visitors (ip, (created_at::date));

-- Fast lookups
CREATE INDEX IF NOT EXISTS idx_visitors_created ON visitors (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors (country);
CREATE INDEX IF NOT EXISTS idx_visitors_referrer ON visitors (referrer);

-- Allow inserts from anon key (public tracking)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON visitors
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow admin reads" ON visitors
  FOR SELECT TO anon
  USING (true);
