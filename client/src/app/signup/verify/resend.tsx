'use client';

import styles from '@/styles/login.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const Resend = () => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get('token'));
    }, []);

    const handleResend = async () => {
        try {
            if (!token) {
                toast.error('再発行用トークンが見つかりません。');
                return
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            })

            if (!res.ok) {
                const errorData = await res.json();
                toast.error('認証コードの再発行に失敗しました。');
                console.error(errorData.message);
                return;
            }

            const data = await res.json();

            router.push(data.reissueUrl);
        } catch (err) {
            console.error(err)
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
        }
    };

    return (
        <p className={styles.reference} onClick={handleResend}>認証コードを再発行する</p>
    );
}