'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from '@/styles/login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { sleep } from '@/lib/sleep';

export const LoginForm = () => {
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
            rememberMe: rememberMe ? 'true' : 'false',
        });

        setLoading(false);

        if (res?.error) {
            toast.error('メールアドレスまたはパスワードが正しくありません。');
        } else if (res?.ok) {
            toast.success('ログインしました');

            await sleep(1200);
            router.push('/my-page');
        }
    };

    const isDisabled = loading || !email || !password;

    return (
        <div>
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

            <div className="mt-6">
                <p className={styles.formText}>パスワード</p>
                <div className="relative">
                    <input
                        type={visible ? 'text' : 'password'}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
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
            </div>

            <label className={styles.checkLabel}>
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkbox}
                />
                <span className={styles.checkText}>ログイン状態を保持する</span>
            </label>

            <button type="submit" className={styles.mainB} disabled={isDisabled} onClick={handleSubmit}>
                {loading ? 'ログイン中...' : 'ログインする'}
            </button>
        </div>
    );
};
