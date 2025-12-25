import 'next-auth';

declare module 'next-auth' {
    interface User {
        isAdmin?: boolean;
        clearanceLevel?: number;
    }

    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            isAdmin?: boolean;
            clearanceLevel?: number;
        };
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        isAdmin?: boolean;
        clearanceLevel?: number;
    }
}
