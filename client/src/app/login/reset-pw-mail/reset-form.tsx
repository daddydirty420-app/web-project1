'use client';

import { useState } from 'react';
import styles from '@/styles/login.module.css';

export const ResetForm = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            alert(data.message);
        } catch (error) {
            console.error(error);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
        }
    };

    const isDisabled = !email;

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

            <button
            type="submit"
            className={styles.mainB}
            disabled={isDisabled}>メールを送信する</button>
        </form>
    );
}