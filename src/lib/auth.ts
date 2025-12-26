import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import { SupabaseAdapter } from "@auth/supabase-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
    basePath: '/api/auth',
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Resend({
            apiKey: process.env.RESEND_API_KEY,
            from: 'noreply@archetypeorigininc.com',
        }),
    ],
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
