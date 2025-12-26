import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';

/**
 * AUTH CONFIGURATION WITH ERROR HANDLING
 * Lazy initialization to catch module-level errors
 */

// Log environment for debugging (will appear in Vercel function logs)
console.log('[AUTH] Initializing with env:', {
    hasGithubId: !!process.env.GITHUB_ID,
    hasGithubSecret: !!process.env.GITHUB_SECRET,
    hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasSecret: !!(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET),
});

let authResult: ReturnType<typeof NextAuth> | null = null;
let authError: Error | null = null;

try {
    // Build providers array - only add if configured
    const providers = [];
    
    if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
        providers.push(GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }));
        console.log('[AUTH] Added GitHub provider');
    }
    
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        providers.push(Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }));
        console.log('[AUTH] Added Google provider');
    }
    
    if (process.env.RESEND_API_KEY) {
        providers.push(Resend({
            apiKey: process.env.RESEND_API_KEY,
            from: 'onboarding@resend.dev',
        }));
        console.log('[AUTH] Added Resend provider');
    }

    if (providers.length === 0) {
        throw new Error('No auth providers configured - missing environment variables');
    }

    authResult = NextAuth({
        providers,
        secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
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
                    const adminEmail = process.env.ADMIN_EMAIL;
                    token.isAdmin = adminEmail ? user.email === adminEmail : false;
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
        },
        session: { strategy: 'jwt' },
        trustHost: true,
    });
    
    console.log('[AUTH] Initialization successful');
} catch (error) {
    authError = error instanceof Error ? error : new Error(String(error));
    console.error('[AUTH] Initialization failed:', authError.message);
    console.error('[AUTH] Stack:', authError.stack);
}

// Export with fallback for errors
export const handlers = authResult?.handlers || {
    GET: () => Response.json({ error: 'Auth not initialized', message: authError?.message }),
    POST: () => Response.json({ error: 'Auth not initialized', message: authError?.message }),
};

export const auth = authResult?.auth || (async () => null);
export const signIn = authResult?.signIn || (async () => { throw authError || new Error('Auth not initialized'); });
export const signOut = authResult?.signOut || (async () => { throw authError || new Error('Auth not initialized'); });

// Export the error for debugging
export const getAuthError = () => authError;
