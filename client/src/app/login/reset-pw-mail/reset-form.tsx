'use client';

import { useState } from 'react';
import styles from '@/styles/login.module.css';
import toast from 'react-hot-toast';

export const ResetForm = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            toast.success("メールを送信しました");
        } catch (err) {
            toast.success("メールを送信しました");
        }
    };

    const isDisabled = !email;

    return (
        <form>
            <p className={styles.formText}>メールアドレス</p>
            <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="****@****.***"
                className={styles.input}
                required
            />

            <button
            type="submit"
            className={styles.mainB}
            disabled={isDisabled}
            onClick={handleSubmit}
            >
                メールを送信する
            </button>
        </form>
    );
};
