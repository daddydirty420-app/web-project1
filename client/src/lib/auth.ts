import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface AuthUser {
    id: string;
    email: string;
    user_name?: string;
    rememberMe?: string;
    accessToken: string;
    refreshToken?: string;
};

type LoginBody = 
| { email: string; password: string; } 
| { accessToken: string; refreshToken: string; };

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" },
                rememberMe: { label: "RememberMe", type: "checkbox" },
                accessToken: { label: "AccessToken", type: "text" },
                refreshToken: { label: "RefreshToken", type: "text" },
            },
            async authorize(credentials): Promise<AuthUser | null> {
                if ((!credentials?.email || !credentials?.password) && (!credentials?.accessToken || !credentials?.refreshToken)) {
                    return null;
                }

                try {
                    let body: LoginBody;

                    if (credentials?.email && credentials?.password) {
                        body = {
                            email: credentials.email,
                            password: credentials.password,
                        }
                    } else if (credentials?.accessToken && credentials?.refreshToken) {
                        body = {
                            accessToken: credentials.accessToken,
                            refreshToken: credentials.refreshToken,
                        }
                    } else {
                        return null;
                    }

                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                        credentials: "include",
                    });

                    if (!res.ok) return null;

                    return await res.json();
                } catch (err) {
                    console.error("Authorize error:", err);
                    return null;
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.user_name = user.user_name;
                token.admin = user.admin;
                token.rememberMe = user.rememberMe === "true";
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;

                const now = Math.floor(Date.now() / 1000);
                const days = token.rememberMe ? 30 : 3;
                token.exp = now + days * 24 * 60 * 60;
            };
            return token;
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.user_name = token.user_name as string;
                session.user.admin = token.admin as boolean;
                session.accessToken = token.accessToken as string;
                session.refreshToken = token.refreshToken as string;
            };
            return session;
        },
    },

    pages: {
        signIn: "/login",
    },

    jwt: {
        maxAge: 3 * 24 * 60 * 60,
    },
};