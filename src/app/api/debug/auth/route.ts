import { NextResponse } from 'next/server';

/**
 * GET /api/debug/auth
 * Debug endpoint to check auth configuration
 * Remove in production!
 */
export async function GET() {
    const config = {
        // Check which providers are configured (don't show actual values)
        github: {
            id: !!process.env.GITHUB_ID,
            secret: !!process.env.GITHUB_SECRET,
            idLength: process.env.GITHUB_ID?.length || 0,
            secretLength: process.env.GITHUB_SECRET?.length || 0,
        },
        google: {
            id: !!process.env.GOOGLE_CLIENT_ID,
            secret: !!process.env.GOOGLE_CLIENT_SECRET,
            idLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
            secretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
        },
        resend: {
            key: !!process.env.RESEND_API_KEY,
            keyLength: process.env.RESEND_API_KEY?.length || 0,
        },
        nextauth: {
            secret: !!process.env.NEXTAUTH_SECRET,
            secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
            url: process.env.NEXTAUTH_URL || 'NOT SET',
        },
        admin: {
            email: process.env.ADMIN_EMAIL || 'NOT SET',
        },
        supabase: {
            url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
        timestamp: new Date().toISOString(),
    };

    return NextResponse.json(config);
}
