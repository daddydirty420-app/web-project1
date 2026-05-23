"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../../../../lib/api/apiError";
import { sleep } from "../../../../../lib/sleep";
import { fetchNewEmail } from "../../../api/email/client";

type Props = {
    token: string;
};

export const FetchClient = ({ token }: Props) => {
    const router = useRouter();

    useEffect(() => {
        if (!token) return;

        const fetchAPI = async () => {
            try {
                await fetchNewEmail(token);

                toast.success("メールアドレスの更新処理が完了しました");

                await sleep(2000);
                router.push("/my-page");
            } catch (err) {
                if (err instanceof ApiError) {
                    toast.error("メールアドレスの更新処理に失敗しました");
                    return;
                }

                alert("サーバーエラーが発生しました。通信環境を確認し、再度ページを読み込んでください");
            }
        };

        fetchAPI();
    }, [token, router]);

    return <div></div>;
};
