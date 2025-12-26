import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';

// Admin emails that have elevated access
const ADMIN_EMAILS = [
    process.env.ADMIN_EMAIL,
].filter(Boolean) as string[];

// Export auth handlers using Auth.js v5 pattern
export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GitHub,
        Google,
        Resend({
            from: process.env.EMAIL_FROM || 'ARCHETYPE ORIGIN DYNAMICS <noreply@archetypeorigininc.com>',
        }),
    ],

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
});
