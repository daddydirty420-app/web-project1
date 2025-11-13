import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            user_name?: string;
            admin?: boolean;
            accessToken?: string;
            refreshToken?: string;
        } & DefaultSession["user"];
        accessToken?: string;
        refreshToken?: string;
    }

    interface User extends DefaultUser {
        id: string;
        email: string;
        user_name?: string;
        admin?: boolean;
        rememberMe?: boolean;
        accessToken?: string;
        refreshToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        email?: string;
        user_name?: string;
        admin?: boolean;
        rememberMe?: boolean;
        accessToken?: string;
        refreshToken?: string;
    }
}