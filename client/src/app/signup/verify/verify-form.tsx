'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from '@/styles/login.module.css';
import { signIn } from "next-auth/react";

export default function VerifyForm() {
    const [code, setCode] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [referenceVisible, setReferenceVisible] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const code = formData.get('verify-code') as string;
        const rememberMeValue = rememberMe;
        const referenceCode = formData.get('reference-code');

        try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup-verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    verificationCode: code,
                    rememberMe: rememberMeValue
                }),
            });

            if (!verifyRes.ok) {
                const errorData = await verifyRes.json();
                return alert(errorData.message);
            }

            const verifyData = await verifyRes.json();

            const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signup-create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${verifyData.accessToken}`,
                },
            });

            if (!createRes.ok) {
                const errorData = await createRes.json();
                return alert(errorData.message);
            }

            if (typeof referenceCode === 'string' && referenceCode.trim() !== '') {
                const refRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reference_code/input`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input: referenceCode })
                });

                if (!refRes.ok) {
                    const errorData = await refRes.json();
                    return alert(errorData.message);
                }
            }

            const res = await signIn("credentials", {
                redirect: false,
                email: verifyData.email,
                accessToken: verifyData.accessToken,
                refreshToken: verifyData.refreshToken,
                rememberMe: rememberMeValue,
            });

            if (res?.ok) {
                router.push('/my-page');
            } else {
                alert("認証に失敗しました。");
            }
        } catch (err) {
            console.error(err);
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

            <label className='flex mt-6 items-center justify-center'>
                <input
                type='checkbox'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={styles.checkbox}
                />
                <p className={styles.formText}>ログイン状態を保持する</p>
            </label>

            <button type="submit" className={styles.green}>認証する</button>

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
    )
}