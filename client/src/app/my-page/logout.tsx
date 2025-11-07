'use client';

import { NormalLinkContainer } from "components/link";
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
            console.error("ログアウト失敗！", err);
        }
    };

    return (
        <NormalLinkContainer>
            <div className={styles.linkElem} onClick={logout}>
                <p className='text-[var(--alert)]'>ログアウト</p>
            </div>
        </NormalLinkContainer>
    );
};