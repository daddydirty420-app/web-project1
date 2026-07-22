"use client";

import { sleep } from "@/lib/sleep";
import styles from "@/styles/login.module.css";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../lib/api/apiError";
import { fetchSignup } from "./api/auth";

export const SignupForm = () => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);

        if (password !== confirmPassword) {
            setErrorMsg("パスワードが一致しません");

            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setVisible(false);
            setConfirmVisible(false);

            setLoading(false);
            return;
        }

        const trimEmail = email.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimEmail)) {
            toast.error("正しいメールアドレスの形式で入力してください");

            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setVisible(false);
            setConfirmVisible(false);

            setLoading(false);
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorMsg("パスワードは半角小文字英字と数字を含む8文字以上にしてください");

            setPassword("");
            setConfirmPassword("");
            setVisible(false);
            setConfirmVisible(false);

            setLoading(false);
            return;
        }

        setErrorMsg("");

        try {
            const data = await fetchSignup(trimEmail, password);

            toast.success("認証コードを発行しました");

            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setVisible(false);
            setConfirmVisible(false);

            setLoading(false);
            await sleep(1500);

            router.push(data.reissueUrl);
        } catch (err) {
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setVisible(false);
            setConfirmVisible(false);

            setLoading(false);
            
            if (err instanceof ApiError) {
                switch (err.code) {
                    case "ALREADY_USED_EMAIL":
                        toast.error("このメールアドレスは既に使用されています");
                        break;
                    case "INVALID_PASSWORD":
                        toast.error("このパスワードは無効です");
                        break;
                    default:
                        toast.error("会員登録に失敗しました");
                }
                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const isDisabled = !email || !password || !confirmPassword;

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
                        type={visible ? "text" : "password"}
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
                        type={confirmVisible ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="********"
                        className={styles.input}
                        required
                    />
                    <FontAwesomeIcon
                        icon={confirmVisible ? faEyeSlash : faEye}
                        onClick={() => setConfirmVisible((v) => !v)}
                        className={styles.icon}
                    />
                </div>
                {errorMsg && <p className={`${styles.small} ${styles.alert}`}>{errorMsg}</p>}
            </div>

            <button type="submit" className={styles.mainB} disabled={isDisabled} onClick={handleSubmit}>
                {loading ? "送信中..." : "認証メールを送る"}
            </button>
        </div>
    );
};
