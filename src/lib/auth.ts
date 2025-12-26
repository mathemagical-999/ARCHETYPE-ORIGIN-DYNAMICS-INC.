import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';

// Admin emails that have elevated access
const ADMIN_EMAILS = [
    process.env.ADMIN_EMAIL,
].filter(Boolean) as string[];

// Build config with error handling
function buildConfig(): NextAuthConfig {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const providers: any[] = [];

    // GitHub - check both old and new env var names
    const githubId = process.env.AUTH_GITHUB_ID || process.env.GITHUB_ID;
    const githubSecret = process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_SECRET;
    
    if (githubId && githubSecret) {
        // Dynamic import to avoid initialization errors
        const GitHub = require('next-auth/providers/github').default;
        providers.push(GitHub({ clientId: githubId, clientSecret: githubSecret }));
    }

    // Google
    const googleId = process.env.AUTH_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const googleSecret = process.env.AUTH_GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    
    if (googleId && googleSecret) {
        const Google = require('next-auth/providers/google').default;
        providers.push(Google({ clientId: googleId, clientSecret: googleSecret }));
    }

    // Resend
    const resendKey = process.env.AUTH_RESEND_KEY || process.env.RESEND_API_KEY;
    
    if (resendKey) {
        const Resend = require('next-auth/providers/resend').default;
        providers.push(Resend({
            apiKey: resendKey,
            from: process.env.EMAIL_FROM || 'ARCHETYPE ORIGIN DYNAMICS <onboarding@resend.dev>',
        }));
    }

    return {
        providers,

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
                const isLoggedIn = !!auth?.user;
                const isAdmin = auth?.user?.isAdmin;
                const isOnAdmin = nextUrl.pathname.startsWith('/admin');

                if (isOnAdmin) {
                    if (!isLoggedIn) {
                        return Response.redirect(new URL('/auth/signin', nextUrl));
                    }
                    if (!isAdmin) {
                        return Response.redirect(new URL('/unauthorized', nextUrl));
                    }
                }
                return true;
            },
        },

        session: {
            strategy: 'jwt',
            maxAge: 30 * 24 * 60 * 60,
        },

        trustHost: true,
        debug: process.env.NODE_ENV === 'development',
    };
}

// Export auth handlers
export const { handlers, auth, signIn, signOut } = NextAuth(buildConfig());
