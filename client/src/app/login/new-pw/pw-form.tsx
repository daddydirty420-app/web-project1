'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/login.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

export default function PwForm() {
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            alert('無効なリンクです。');
            router.push('/login');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('パスワードが一致しません。');
            return;
        }

        const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!regex.test(password)) {
            setErrorMsg('パスワードは半角小文字英字と数字を含む8文字以上にしてください。');
            return;
        }

        setErrorMsg('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-pw`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await res.json();

            if (res.ok) {
                console.log(data.message);
                router.push('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('通信エラーが発生しました。');
        }
    };

    const isDisabled = !password || !confirmPassword;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <p className={styles.formText}>パスワード</p>
                <div className="relative">
                    <input
                    type={visible ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="********"
                    className={styles.input}
                    required
                    />
                    <FontAwesomeIcon 
                    icon={visible ? faEyeSlash : faEye}
                    onClick={() => setVisible((v) => !v)}
                    className={styles.icon}
                    />
                </div>
                <p className={styles.small}>※小文字英字・半角数字必須、8文字以上</p>
            </div>

            <div className="mt-6">
                <p className={styles.formText}>パスワード（確認用）</p>
                <div className="relative">
                    <input
                    type={visible ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    className={styles.input}
                    required
                    />
                    {visible && (
                        <FontAwesomeIcon 
                        icon={faEyeSlash}
                        onClick={() => setVisible((v) => !v)}
                        className={styles.icon}
                        />
                    )}
                    {!visible && (
                        <FontAwesomeIcon
                        icon={faEye}
                        onClick={() => setVisible((v) => !v)}
                        className={styles.icon}
                        />
                    )}
                </div>
                {errorMsg && <p className={`${styles.small} ${styles.alert}`}>{errorMsg}</p>}
            </div>

            <button
            type="submit"
            className={styles.mainB}
            disabled={isDisabled}>リセットする</button>
        </form>
    );
}