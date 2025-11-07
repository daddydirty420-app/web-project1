"use client";

import { useEffect } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

type Props = {
    session: Session | null;
    token: string;
};

export default function FetchClient({ session, token }: Props) {
    const router = useRouter();

    useEffect(() => {
        if (!session || !token) return;

        const fetchAPI = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/new-email-change?token=${token}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session?.accessToken ?? ""}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message);
                    return;
                }

                alert(data.message);
                setTimeout(() => router.push("/my-page"), 2000);
            } catch (err) {
                console.error(err);
                alert("サーバーエラーが発生しました。通信環境を確認し、再度ページを読み込んでください。");
            }
        };

        fetchAPI();
    }, [session, token, router]);

    return (
        <div></div>
    );
};