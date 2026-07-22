"use client";

import { sleep } from "@/lib/sleep";
import styles from "@/styles/login.module.css";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../../lib/api/apiError";
import { fetchResetPw } from "../api/auth";

export const PwForm = () => {
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async () => {
        setLoading(true);

        const token = searchParams.get("token");

        if (!token) {
            toast.error("無効なリンクです");
            setLoading(false);
            await sleep(1000);

            router.push("/login");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg("パスワードが一致しません");
            setLoading(false);
            return;
        }

        const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!regex.test(password)) {
            setErrorMsg("パスワードは半角小文字英字と数字を含む8文字以上にしてください");
            setLoading(false);
            return;
        }

        setErrorMsg("");

        try {
            await fetchResetPw(token, password);

            toast.success("パスワードを更新しました。もう一度ログインしてください");
            setLoading(false);
            await sleep(1500);

            router.push("/login");
        } catch (err) {
            setLoading(false);
            if (err instanceof ApiError) {
                toast.error("新しいパスワードの設定に失敗しました");
                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const isDisabled = !password || !confirmPassword;

    return (
        <div>
            <div>
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
                        type={visible ? "text" : "password"}
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
                        <FontAwesomeIcon icon={faEye} onClick={() => setVisible((v) => !v)} className={styles.icon} />
                    )}
                </div>
                {errorMsg && <p className={`${styles.small} ${styles.alert}`}>{errorMsg}</p>}
            </div>

            <button type="submit" className={styles.mainB} disabled={isDisabled} onClick={handleSubmit}>
                {loading ? "リセット中..." : "リセットする"}
            </button>
        </div>
    );
};
