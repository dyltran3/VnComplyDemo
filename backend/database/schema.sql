-- =======================================================
-- VnComplyDemo — Supabase Database Schema
-- Paste this into Supabase SQL Editor and run
-- =======================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================================================
-- TABLE: users
-- Stores scanner platform accounts (NOT target app users)
-- =======================================================
CREATE TABLE IF NOT EXISTS public.users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name   TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- TABLE: scans
-- Each scan job submitted by a user
-- =======================================================
CREATE TABLE IF NOT EXISTS public.scans (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
    target_url  TEXT NOT NULL,
    scan_type   TEXT DEFAULT 'full', -- 'privacy', 'security', 'full'
    status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    progress    INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    error_msg   TEXT,
    started_at  TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_status  ON public.scans(status);

-- =======================================================
-- TABLE: findings
-- Individual findings from any scan (privacy or security)
-- =======================================================
CREATE TABLE IF NOT EXISTS public.findings (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id       UUID NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
    category      TEXT NOT NULL,   -- 'privacy' | 'owasp'
    subcategory   TEXT,            -- e.g. 'A03-Injection', 'pre-consent-tracking'
    severity      TEXT NOT NULL CHECK (severity IN ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    title         TEXT NOT NULL,
    description   TEXT NOT NULL,
    evidence      TEXT,            -- raw payload / request-response snippet
    screenshot_url TEXT,           -- Supabase Storage path
    url           TEXT,            -- the specific URL where the finding was detected
    cvss_score    NUMERIC(4,1),    -- e.g. 8.1
    owasp_ref     TEXT,            -- e.g. 'A01:2021'
    nd13_ref      TEXT,            -- e.g. 'Điều 9, Khoản 1'
    remediation   TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_findings_scan_id  ON public.findings(scan_id);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON public.findings(severity);
CREATE INDEX IF NOT EXISTS idx_findings_category ON public.findings(category);

-- =======================================================
-- TABLE: reports
-- Generated reports per scan
-- =======================================================
CREATE TABLE IF NOT EXISTS public.reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id         UUID UNIQUE NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
    privacy_score   INTEGER CHECK (privacy_score >= 0 AND privacy_score <= 100),
    security_score  INTEGER CHECK (security_score >= 0 AND security_score <= 100),
    overall_score   INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    risk_level      TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    html_url        TEXT,   -- Supabase Storage path for HTML report
    pdf_url         TEXT,   -- Supabase Storage path for PDF report
    summary         TEXT,   -- Executive summary JSON blob
    generated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only see their own data
-- =======================================================
ALTER TABLE public.users   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own rows (backend uses service_role key, bypasses RLS)
-- These policies are a safety net for direct client queries
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own scans"
    ON public.scans FOR ALL USING (
        user_id IN (SELECT id FROM public.users WHERE id::text = auth.uid()::text)
    );

CREATE POLICY "Users can view findings from own scans"
    ON public.findings FOR SELECT USING (
        scan_id IN (SELECT id FROM public.scans WHERE user_id::text = auth.uid()::text)
    );

CREATE POLICY "Users can view own reports"
    ON public.reports FOR SELECT USING (
        scan_id IN (SELECT id FROM public.scans WHERE user_id::text = auth.uid()::text)
    );

-- =======================================================
-- VIEWS (optional helpers for dashboard queries)
-- =======================================================
CREATE OR REPLACE VIEW public.scan_summary AS
SELECT
    s.id,
    s.user_id,
    s.target_url,
    s.scan_type,
    s.status,
    s.progress,
    s.created_at,
    s.finished_at,
    r.privacy_score,
    r.security_score,
    r.overall_score,
    r.risk_level,
    COUNT(f.id) AS total_findings,
    COUNT(f.id) FILTER (WHERE f.severity = 'CRITICAL') AS critical_count,
    COUNT(f.id) FILTER (WHERE f.severity = 'HIGH')     AS high_count,
    COUNT(f.id) FILTER (WHERE f.severity = 'MEDIUM')   AS medium_count
FROM public.scans s
LEFT JOIN public.reports r  ON r.scan_id = s.id
LEFT JOIN public.findings f ON f.scan_id = s.id
GROUP BY s.id, s.user_id, s.target_url, s.scan_type, s.status, s.progress,
         s.created_at, s.finished_at, r.privacy_score, r.security_score,
         r.overall_score, r.risk_level;
