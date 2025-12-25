-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║         ARCHETYPE ORIGIN DYNAMICS INC. — ENTERPRISE DATABASE SCHEMA       ║
-- ║                    Multi-Trillion Dollar Architecture                      ║
-- ║                         Version: 002 - Enhanced                           ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

-- ============================================
-- STEP 1: ENABLE REQUIRED EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE 1: believers (Waitlist)
-- Purpose: Collect and manage waitlist signups
-- ============================================
DROP TABLE IF EXISTS believers CASCADE;

CREATE TABLE believers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT,
  clearance_level INT DEFAULT 0 CHECK (clearance_level >= 0 AND clearance_level <= 10),
  waitlist_position SERIAL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'churned')),
  referral_source TEXT,
  referral_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  referred_by UUID REFERENCES believers(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for believers
CREATE INDEX IF NOT EXISTS idx_believers_email ON believers (email);
CREATE INDEX IF NOT EXISTS idx_believers_status ON believers (status);
CREATE INDEX IF NOT EXISTS idx_believers_created_at ON believers (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_believers_position ON believers (waitlist_position);
CREATE INDEX IF NOT EXISTS idx_believers_referral ON believers (referral_code);

COMMENT ON TABLE believers IS 'Waitlist signups for THE ALCHEMIST access';

-- ============================================
-- TABLE 2: admins
-- Purpose: Admin users with command center access
-- ============================================
DROP TABLE IF EXISTS admins CASCADE;

CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin', 'overlord')),
  clearance_level INT DEFAULT 1 CHECK (clearance_level >= 0 AND clearance_level <= 10),
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  login_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for admins
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins (email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins (role);

COMMENT ON TABLE admins IS 'Admin users with access to command center';

-- ============================================
-- TABLE 3: telemetry (Analytics Events)
-- Purpose: Track all user interactions
-- ============================================
DROP TABLE IF EXISTS telemetry CASCADE;

CREATE TABLE telemetry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_name TEXT,
  session_id TEXT,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  page_path TEXT,
  referrer TEXT,
  duration_ms INT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for telemetry
CREATE INDEX IF NOT EXISTS idx_telemetry_event_type ON telemetry (event_type);
CREATE INDEX IF NOT EXISTS idx_telemetry_created_at ON telemetry (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_session_id ON telemetry (session_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_page_path ON telemetry (page_path);

COMMENT ON TABLE telemetry IS 'Analytics events from the website';

-- ============================================
-- TABLE 4: contact_submissions
-- Purpose: Store contact form submissions
-- ============================================
DROP TABLE IF EXISTS contact_submissions CASCADE;

CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  topic TEXT DEFAULT 'general' CHECK (topic IN ('general', 'partnership', 'investment', 'support', 'press')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  ip_address INET,
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions (email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions (status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions (created_at DESC);

COMMENT ON TABLE contact_submissions IS 'Contact form submissions from website';

-- ============================================
-- TABLE 5: email_logs
-- Purpose: Track all sent emails
-- ============================================
DROP TABLE IF EXISTS email_logs CASCADE;

CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('waitlist_confirmation', 'access_granted', 'admin_notification', 'magic_link', 'newsletter')),
  subject TEXT,
  resend_id TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_recipient ON email_logs (recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_type ON email_logs (email_type);
CREATE INDEX IF NOT EXISTS idx_email_created ON email_logs (created_at DESC);

COMMENT ON TABLE email_logs IS 'Log of all emails sent through the system';

-- ============================================
-- TABLE 6: audit_logs (Compliance & Security)
-- Purpose: Track all admin actions for compliance
-- ============================================
DROP TABLE IF EXISTS audit_logs CASCADE;

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES admins(id),
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs (resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at DESC);

COMMENT ON TABLE audit_logs IS 'Audit trail for compliance and security';

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE believers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Believers: Only service role can access
CREATE POLICY "Service role manages believers"
  ON believers FOR ALL
  USING (auth.role() = 'service_role');

-- Admins: Only service role can access
CREATE POLICY "Service role manages admins"
  ON admins FOR ALL
  USING (auth.role() = 'service_role');

-- Telemetry: Insert allowed for anon, select only for service role
CREATE POLICY "Anyone can insert telemetry"
  ON telemetry FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role reads telemetry"
  ON telemetry FOR SELECT
  USING (auth.role() = 'service_role');

-- Contact Submissions: Insert for anon, all for service role
CREATE POLICY "Anyone can submit contact"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role manages contacts"
  ON contact_submissions FOR ALL
  USING (auth.role() = 'service_role');

-- Email Logs: Service role only
CREATE POLICY "Service role manages email logs"
  ON email_logs FOR ALL
  USING (auth.role() = 'service_role');

-- Audit Logs: Service role only
CREATE POLICY "Service role manages audit logs"
  ON audit_logs FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_believers_updated_at ON believers;
CREATE TRIGGER update_believers_updated_at
  BEFORE UPDATE ON believers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get waitlist statistics
CREATE OR REPLACE FUNCTION get_waitlist_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', (SELECT COUNT(*) FROM believers),
    'pending', (SELECT COUNT(*) FROM believers WHERE status = 'pending'),
    'approved', (SELECT COUNT(*) FROM believers WHERE status = 'approved'),
    'rejected', (SELECT COUNT(*) FROM believers WHERE status = 'rejected'),
    'today', (SELECT COUNT(*) FROM believers WHERE created_at >= CURRENT_DATE)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve believer
CREATE OR REPLACE FUNCTION approve_believer(believer_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE believers
  SET status = 'approved',
      approved_at = NOW(),
      clearance_level = 1
  WHERE id = believer_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEWS (For Dashboard Queries)
-- ============================================

-- Daily signup metrics
CREATE OR REPLACE VIEW daily_signups AS
SELECT 
  DATE(created_at) as signup_date,
  COUNT(*) as total_signups,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'pending') as pending
FROM believers
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;

-- ============================================
-- SEED DATA: ADMIN ACCOUNT
-- ============================================
INSERT INTO admins (email, name, role, clearance_level)
VALUES ('archetype.origin.dynamics@gmail.com', 'Founder', 'overlord', 10)
ON CONFLICT (email) DO UPDATE SET role = 'overlord', clearance_level = 10;

-- ============================================
-- GRANTS
-- ============================================
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
