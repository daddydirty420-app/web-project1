"use client";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button, InputStr } from "../../../components/inputForm";
import { sleep } from "../../../lib/sleep";
import { fetchPasswordEdit } from "../api/password/client";
import EditUI from "../editUI";
import styles from "./styles.module.css";

export const PasswordEditForm = () => {
    const [currentPwVisible, setCurrentPwVisible] = useState(false);
    const [newPwVisible, setNewPwVisible] = useState(false);
    const [confirmNewPwVisible, setConfirmNewPwVisible] = useState(false);
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmNewPw, setConfirmNewPw] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const submit = async () => {
        setLoading(true);

        if (newPw === currentPw) {
            toast.error("パスワードが変更されていません");
            setLoading(false);
            return;
        }

        if (newPw !== confirmNewPw) {
            toast.error("パスワードが一致しません");
            setLoading(false);
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(newPw)) {
            toast.error("パスワードは半角小文字英字と数字を含む8文字以上にしてください");
            setLoading(false);
            return;
        }

        try {
            await fetchPasswordEdit({ currentPw, newPw });

            toast.success("パスワードの変更が完了しました");

            setCurrentPw("");
            setNewPw("");
            setConfirmNewPw("");
            setCurrentPwVisible(false);
            setNewPwVisible(false);
            setConfirmNewPwVisible(false);

            setLoading(false);
            await sleep(1500);

            router.back();
        } catch (err) {
            setLoading(false);

            alert("システムエラーが発生しました。時間をおいて再試行してください。");
        }
    };

    const isDisabled = loading || !currentPw || !newPw || !confirmNewPw;

    return (
        <EditUI title="パスワード変更">
            <div className={styles.passwordRelativeDiv}>
                <InputStr
                    title="現在のパスワード"
                    type={currentPwVisible ? "text" : "password"}
                    value={currentPw}
                    onChange={setCurrentPw}
                    placeholder="********"
                    hissu
                />

                <FontAwesomeIcon
                    icon={currentPwVisible ? faEyeSlash : faEye}
                    onClick={() => setCurrentPwVisible((v) => !v)}
                    className={styles.icon}
                />
            </div>

            <div className={styles.passwordRelativeDiv}>
                <InputStr
                    title="新しいパスワード"
                    type={newPwVisible ? "text" : "password"}
                    value={newPw}
                    onChange={setNewPw}
                    placeholder="********"
                    hissu
                />

                <FontAwesomeIcon
                    icon={newPwVisible ? faEyeSlash : faEye}
                    onClick={() => setNewPwVisible((v) => !v)}
                    className={styles.icon}
                />
            </div>

            <div className={styles.passwordRelativeDiv}>
                <InputStr
                    title="新しいパスワード（確認用）"
                    type={confirmNewPwVisible ? "text" : "password"}
                    value={confirmNewPw}
                    onChange={setConfirmNewPw}
                    placeholder="********"
                    hissu
                />

                <FontAwesomeIcon
                    icon={confirmNewPwVisible ? faEyeSlash : faEye}
                    onClick={() => setConfirmNewPwVisible((v) => !v)}
                    className={styles.icon}
                />
            </div>

            <Button onClick={submit} disabled={isDisabled}>
                {loading ? "変更中..." : "変更する"}
            </Button>
        </EditUI>
    );
};
