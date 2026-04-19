"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { sleep } from "../../../../../lib/sleep";

type Props = {
    token: string;
};

export const FetchClient = ({ token }: Props) => {
    const router = useRouter();

    useEffect(() => {
        if (!token) return;

        const fetchAPI = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/new-email?token=${token}`, {
                    method: "PATCH",
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message);
                    return;
                }

                toast.success(data.message);

                await sleep(2000);
                router.push("/my-page");
            } catch (err) {
                console.error(err);
                alert("サーバーエラーが発生しました。通信環境を確認し、再度ページを読み込んでください。");
            }
        };

        fetchAPI();
    }, [token, router]);

    return <div></div>;
};
