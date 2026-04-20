"use client";

import { NormalLinkContainer } from "@/components/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./mypage.module.css";

export const Logout = () => {
    const router = useRouter();

    const logout = async () => {
        try {
            await signOut({
                redirect: false,
            });

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/clear-cookie`, {
                method: "POST",
                credentials: "include",
            });

            router.push("/");
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error("ログアウト失敗！", err);
        }
    };

    return (
        <NormalLinkContainer>
            <div className={styles.linkElem} onClick={logout}>
                <p className={styles.red}>ログアウト</p>
            </div>
        </NormalLinkContainer>
    );
};
