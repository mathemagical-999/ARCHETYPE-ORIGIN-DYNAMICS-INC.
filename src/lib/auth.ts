import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import type { NextAuthConfig } from 'next-auth';

// Admin emails that have elevated access
const ADMIN_EMAILS = [
    process.env.ADMIN_EMAIL,
].filter(Boolean) as string[];

// Build providers array conditionally
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = [];

// Only add GitHub if credentials exist
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        })
    );
}

// Only add Google if credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

// Only add Resend if API key exists
if (process.env.RESEND_API_KEY) {
    providers.push(
        Resend({
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.EMAIL_FROM || 'ARCHETYPE ORIGIN DYNAMICS <noreply@archetypeorigininc.com>',
        })
    );
}

// Log which providers are available (for debugging)
console.log('[AUTH] Available providers:', providers.map(p => p.id || p.name));

// NextAuth configuration
export const authConfig: NextAuthConfig = {
    providers,

    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
        verifyRequest: '/auth/verify',
    },

    callbacks: {
        // Control who can sign in
        async signIn({ user }) {
            // For admin panel, only allow whitelisted emails
            // You can modify this to allow any authenticated user
            // and just restrict admin routes
            return true; // Allow all sign-ins
        },

        // Add custom data to JWT token
        async jwt({ token, user }) {
            if (user?.email) {
                // Check if user is an admin
                token.isAdmin = ADMIN_EMAILS.includes(user.email);
                token.clearanceLevel = token.isAdmin ? 10 : 0;
            }
            return token;
        },

        // Add custom data to session
        async session({ session, token }) {
            if (session.user) {
                session.user.isAdmin = token.isAdmin as boolean;
                session.user.clearanceLevel = token.clearanceLevel as number;
            }
            return session;
        },

        // Protect admin routes
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdmin = auth?.user?.isAdmin;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnAuth = nextUrl.pathname.startsWith('/auth');

            if (isOnAdmin) {
                if (!isLoggedIn) {
                    return Response.redirect(new URL('/auth/signin', nextUrl));
                }
                if (!isAdmin) {
                    return Response.redirect(new URL('/unauthorized', nextUrl));
                }
                return true;
            }

            // Allow all other routes
            return true;
        },
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    trustHost: true,

    debug: process.env.NODE_ENV === 'development',
};

// Export auth handlers
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Note: Type augmentations for next-auth are handled separately
// The isAdmin and clearanceLevel properties work at runtime

