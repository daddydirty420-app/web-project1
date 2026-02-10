"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
    token: string;
};

export const FetchClient = ({ token }: Props) => {
    const router = useRouter();

    useEffect(() => {
        if (!token) return;

        const fetchAPI = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/new-email-change?token=${token}`, {
                    method: "PATCH",
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message);
                    return;
                }

                toast.success(data.message);
                setTimeout(() => router.push("/my-page"), 2000);
            } catch (err) {
                console.error(err);
                alert("サーバーエラーが発生しました。通信環境を確認し、再度ページを読み込んでください。");
            }
        };

        fetchAPI();
    }, [token, router]);

    return (
        <div></div>
    );
};