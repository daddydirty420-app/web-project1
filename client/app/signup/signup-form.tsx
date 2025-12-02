'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/login.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

export default function SignupForm() {
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log(data.message);
                router.push(data.reissueUrl);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('通信エラーが発生しました。');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p className={styles.formText}>メールアドレス</p>
            <input
            type='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
            placeholder='****@****.***'
            className={styles.input}
            required
            />

            <div className="mt-6">
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
                <p className={styles.small}>※ 小文字英字・半角数字必須、8文字以上</p>
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
                    <FontAwesomeIcon 
                    icon={visible ? faEyeSlash : faEye}
                    onClick={() => setVisible((v) => !v)}
                    className={styles.icon}
                    />
                </div>
                {errorMsg && <p className={`${styles.small} ${styles.alert}`}>{errorMsg}</p>}
            </div>

            <button type="submit" className={styles.green}>認証メールを送る</button>
        </form>
    );
}