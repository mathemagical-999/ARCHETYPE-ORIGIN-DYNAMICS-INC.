-- NextAuth.js Supabase Adapter Schema
-- This migration creates the necessary tables for NextAuth.js email authentication

-- Verification tokens table for magic link authentication
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Enable Row Level Security
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy to allow NextAuth service role to manage tokens
CREATE POLICY "Service role can manage verification tokens"
  ON verification_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: Accounts table for linking OAuth providers to users
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage accounts"
  ON accounts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: Sessions table (only needed if using database sessions strategy)
-- Currently using JWT strategy, so this is for future use
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage sessions"
  ON sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS verification_tokens_identifier_idx ON verification_tokens(identifier);
CREATE INDEX IF NOT EXISTS verification_tokens_token_idx ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_session_token_idx ON sessions(session_token);
