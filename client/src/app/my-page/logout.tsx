'use client';

import { NormalLinkContainer } from "@/components/link";
import styles from './mypage.module.css';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";

export default function Logout() {
    const router = useRouter();
    
    const logout = async () => {
        try {
            await signOut({
                redirect: false,
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