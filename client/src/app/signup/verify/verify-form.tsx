'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from '@/styles/login.module.css';
import { signIn } from "next-auth/react";

export default function VerifyForm() {
    const [code, setCode] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [referenceVisible, setReferenceVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!code || code === "") {
            alert("認証コードを入力してください。");
            return;
        }
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const code = formData.get('verify-code') as string;
            const referenceCode = formData.get('reference-code');

            const res = await signIn("verify", {
                verificationCode: code,
                rememberMe,
                redirect: false,
            });

            if (typeof referenceCode === 'string' && referenceCode.trim() !== '') {
                const refRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reference_code/input`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input: referenceCode }),
                });

                if (!refRes.ok) {
                    const errorData = await refRes.json();
                    alert(errorData.message || "紹介コードが正しくありません。");
                    return;
                }
            }

            setLoading(false);

            if (res?.error) {
                alert("認証に失敗しました。");
            } else if (res?.ok) {
                router.push('/my-page');
            }
        } catch (err) {
            console.error("Verify error:", err);
            alert('通信エラーが発生しました。');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p className={styles.formText}>認証コード</p>
            <input
            type='text'
            name='verify-code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='123456'
            minLength={6}
            maxLength={6}
            className={styles.input}
            required
            />

            <label className={styles.checkLabel}>
                <input
                type='checkbox'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={styles.checkbox}
                />
                <p className={styles.checkText}>ログイン状態を保持する</p>
            </label>

            <button
            type="submit"
            className={styles.mainB}
            disabled={loading}
            >
                {loading ? "認証中..." : "認証する"}
            </button>

            <p className={styles.referenceP} onClick={() => setReferenceVisible((v) => !v)}>紹介コードを入力する（ここをクリック）</p>

            {referenceVisible && (
                <div>
                    <input
                    type='text'
                    name='reference-code'
                    placeholder='a1b2c3d4e5'
                    className={styles.input}
                    />
                    <small className={styles.superSmall}>※ 商品を出品後、弊社が確認でき次第、ポイントが付与されます。（目安：3営業日以内）</small>
                    <small className={styles.superSmall}>※ 入力ミスなど間違いがあった場合、ポイントを付与できません。</small>
                </div>
            )}
        </form>
    );
}