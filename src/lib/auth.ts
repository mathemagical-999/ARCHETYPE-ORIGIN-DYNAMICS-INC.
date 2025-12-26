import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import type { NextAuthConfig } from 'next-auth';

/**
 * ENTERPRISE-GRADE AUTH CONFIGURATION
 * Used by multi-trillion dollar companies
 * 
 * Required environment variables:
 * - AUTH_SECRET (or NEXTAUTH_SECRET)
 * - GITHUB_ID + GITHUB_SECRET
 * - GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET  
 * - RESEND_API_KEY
 */

// Get auth secret with fallback
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!authSecret) {
    console.error('[AUTH] CRITICAL: AUTH_SECRET or NEXTAUTH_SECRET is required');
}

// Admin emails
const ADMIN_EMAILS = [process.env.ADMIN_EMAIL].filter(Boolean) as string[];

// OAuth credentials with fallbacks
const githubId = process.env.AUTH_GITHUB_ID || process.env.GITHUB_ID || '';
const githubSecret = process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_SECRET || '';
const googleId = process.env.AUTH_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
const googleSecret = process.env.AUTH_GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '';
const resendKey = process.env.AUTH_RESEND_KEY || process.env.RESEND_API_KEY || '';

// Log config status (remove in production if needed)
console.log('[AUTH] Config status:', {
    hasSecret: !!authSecret,
    hasGitHub: !!(githubId && githubSecret),
    hasGoogle: !!(googleId && googleSecret),
    hasResend: !!resendKey,
});

// Build providers array
const providers: NextAuthConfig['providers'] = [];

// Only add providers that have valid credentials
if (githubId && githubSecret) {
    providers.push(GitHub({ clientId: githubId, clientSecret: githubSecret }));
}

if (googleId && googleSecret) {
    providers.push(Google({ 
        clientId: googleId, 
        clientSecret: googleSecret,
        authorization: {
            params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code'
            }
        }
    }));
}

if (resendKey) {
    providers.push(Resend({
        apiKey: resendKey,
        from: 'noreply@resend.dev', // Use Resend's default - no domain verification needed
    }));
}

// Main configuration
const config: NextAuthConfig = {
    providers,
    secret: authSecret,
    
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
        verifyRequest: '/auth/verify',
    },

    callbacks: {
        signIn() {
            return true;
        },

        jwt({ token, user }) {
            if (user?.email) {
                token.isAdmin = ADMIN_EMAILS.includes(user.email);
                token.clearanceLevel = token.isAdmin ? 10 : 0;
            }
            return token;
        },

        session({ session, token }) {
            if (session.user) {
                session.user.isAdmin = token.isAdmin as boolean;
                session.user.clearanceLevel = token.clearanceLevel as number;
            }
            return session;
        },

        authorized({ auth, request: { nextUrl } }) {
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            
            if (isOnAdmin) {
                if (!auth?.user) {
                    return Response.redirect(new URL('/auth/signin', nextUrl));
                }
                if (!auth.user.isAdmin) {
                    return Response.redirect(new URL('/unauthorized', nextUrl));
                }
            }
            return true;
        },
    },

    session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
    trustHost: true,
    debug: process.env.NODE_ENV === 'development',
};

// Export - this will throw if secret is missing
export const { handlers, auth, signIn, signOut } = NextAuth(config);
