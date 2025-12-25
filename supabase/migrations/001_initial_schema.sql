-- ARCHETYPE ORIGIN DYNAMICS INC.
-- Database Schema Migration
-- Version: 001 - Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: believers (Waitlist)
-- ============================================
CREATE TABLE IF NOT EXISTS believers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  clearance_level INT DEFAULT 0,
  waitlist_position SERIAL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  referral_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for believers
CREATE INDEX IF NOT EXISTS idx_believers_email ON believers (email);
CREATE INDEX IF NOT EXISTS idx_believers_status ON believers (status);
CREATE INDEX IF NOT EXISTS idx_believers_created_at ON believers (created_at DESC);

-- ============================================
-- TABLE: admins
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin', 'overlord')),
  clearance_level INT DEFAULT 1,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for admins
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins (email);

-- ============================================
-- TABLE: telemetry (Analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS telemetry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  page_path TEXT,
  referrer TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for telemetry
CREATE INDEX IF NOT EXISTS idx_telemetry_event_type ON telemetry (event_type);
CREATE INDEX IF NOT EXISTS idx_telemetry_created_at ON telemetry (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_session_id ON telemetry (session_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE believers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry ENABLE ROW LEVEL SECURITY;

-- Believers: Only service role can access
CREATE POLICY "Service role can manage believers"
  ON believers
  FOR ALL
  USING (auth.role() = 'service_role');

-- Admins: Only service role can access
CREATE POLICY "Service role can manage admins"
  ON admins
  FOR ALL
  USING (auth.role() = 'service_role');

-- Telemetry: Insert allowed for anon, select only for service role
CREATE POLICY "Anyone can insert telemetry"
  ON telemetry
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read telemetry"
  ON telemetry
  FOR SELECT
  USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for believers
CREATE TRIGGER update_believers_updated_at
  BEFORE UPDATE ON believers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional)
-- ============================================

-- Insert initial admin (update this with your email)
-- INSERT INTO admins (email, name, role, clearance_level)
-- VALUES ('your-email@example.com', 'Admin', 'overlord', 10)
-- ON CONFLICT (email) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE believers IS 'Waitlist signups for THE ALCHEMIST access';
COMMENT ON TABLE admins IS 'Admin users with access to command center';
COMMENT ON TABLE telemetry IS 'Analytics events from the website';
