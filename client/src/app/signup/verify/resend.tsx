"use client";

import styles from "@/styles/login.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../../lib/api/apiError";
import { sleep } from "../../../lib/sleep";
import { fetchResend } from "../api/auth";

export const Resend = () => {
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleResend = async () => {
        setLoading(true);

        const token = searchParams.get("token");

        if (!token) {
            toast.error("再発行用トークンが見つかりません");
            setLoading(false);
            return;
        }

        try {
            const data = await fetchResend(token);

            toast.success("認証コードを再発行しました");
            setLoading(false);
            await sleep(1500);

            router.push(data.reissueUrl);
        } catch (err) {
            setLoading(false);
            if (err instanceof ApiError) {
                toast.error("認証コードの再発行に失敗しました");
                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    return (
        <p className={styles.reference} onClick={handleResend}>
            {loading ? "認証コード発行中..." : "認証コードを再発行する"}
        </p>
    );
};
