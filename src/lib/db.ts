import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Database type definitions (for documentation and type hints)
export interface Believer {
    id: string;
    email: string;
    ip_address: string | null;
    user_agent: string | null;
    clearance_level: number;
    waitlist_position: number;
    status: 'pending' | 'approved' | 'rejected';
    referral_source: string | null;
    created_at: string;
    metadata: Record<string, unknown>;
}

export interface Admin {
    id: string;
    email: string;
    name: string | null;
    role: 'viewer' | 'editor' | 'admin' | 'overlord';
    clearance_level: number;
    last_login: string | null;
    created_at: string;
}

export interface TelemetryEvent {
    id: string;
    event_type: string;
    session_id: string | null;
    ip_address: string | null;
    user_agent: string | null;
    page_path: string | null;
    referrer: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
}

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client (for client-side operations)
// Using generic client for flexibility
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Admin client (for server-side operations with elevated privileges)
export const supabaseAdmin: SupabaseClient | null = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
    : null;

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
    return !!(supabaseUrl && supabaseAnonKey);
}

// Helper to check if admin operations are available
export function isAdminConfigured(): boolean {
    return !!(supabaseUrl && supabaseServiceKey);
}

