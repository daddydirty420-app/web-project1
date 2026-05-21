"use client";

import styles from "@/styles/login.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ApiError } from "../../../lib/api/apiError";
import { fetchResend } from "../api/auth";

export const Resend = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleResend = async () => {
        const token = searchParams.get("token");

        if (!token) {
            toast.error("再発行用トークンが見つかりません");
            return;
        }

        try {
            const data = await fetchResend(token);

            toast.success("認証コードを再発行しました");

            router.push(data.reissueUrl);
        } catch (err) {
            if (err instanceof ApiError) {
                toast.error("認証コードの再発行に失敗しました");
                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    return (
        <p className={styles.reference} onClick={handleResend}>
            認証コードを再発行する
        </p>
    );
};
