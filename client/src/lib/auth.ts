import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface AuthUser {
    id: string;
    email: string;
    user_name?: string;
    admin?: boolean;
    rememberMe?: boolean;
    accessToken: string;
    refreshToken?: string;
};

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" },
                rememberMe: { label: "RememberMe", type: "checkbox" },
            },
            async authorize(credentials): Promise<AuthUser | null> {
                if (!credentials?.email || !credentials?.password) return null;

                const rememberMe = credentials.rememberMe === "true";

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                        rememberMe,
                    }),
                });

                const data = await res.json();

                if (!res.ok || !data) return null;

                return {
                    id: data.id,
                    email: data.email,
                    user_name: data.user_name,
                    rememberMe: data.rememberMe,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                };
            },
        }),

        CredentialsProvider({
            id: "verify",
            name: "SingupVerify",
            credentials: {
                verificationCode: { label: "verificationCode", type: "text" },
                rememberMe: { label: "RememberMe", type: "checkbox" },
            },
            async authorize(credentials): Promise<AuthUser | null> {
                if (!credentials?.verificationCode) return null;

                const rememberMe = credentials.rememberMe === "true";

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup-verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        verificationCode: credentials.verificationCode,
                        rememberMe,
                    }),
                });

                const data = await res.json();
                if (!res.ok) return null;

                return {
                    id: data.id,
                    email: data.email,
                    user_name: data.user_name,
                    rememberMe: data.rememberMe,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            const now = Math.floor(Date.now() / 1000);

            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.user_name = user.user_name;
                token.admin = user.admin;
                token.rememberMe = user.rememberMe;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;

                const now = Math.floor(Date.now() / 1000);
                const days = token.rememberMe ? 30 : 3;
                token.exp = now + days * 24 * 60 * 60;

                return token;
            };

            if (!token.accessToken || !token.refreshToken) {
                token.error = "MissingTokens";
                return token;
            }

            const expNum = typeof token.exp === "number" ? token.exp : Number(token.exp);

            if (token.exp && now < expNum) {
                return token;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken: token.refreshToken }),
                });

                const data = await res.json();

                if (res.ok && data.accessToken) {
                    token.accessToken = data.accessToken;
                    token.exp = now + 60 * 30;
                    token.error = undefined;
                    return token;
                } else {
                    token.error = "RefreshAccessTokenError";
                    return token;
                }
            } catch (err) {
                console.error("JWT Refresh error:", err);
                token.error = "RefreshAccessTokenError";
                return token;
            }
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.user_name = token.user_name as string;
            session.user.admin = token.admin as boolean;
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;

            if (token.error) {
                session.error = token.error;
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
};