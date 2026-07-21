"use client";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { InputStr } from "../../../components/inputForm";
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

    const handleSubmit = async () => {
        if (newPw !== confirmNewPw) {
            toast.error("パスワードが一致しません");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(newPw)) {
            toast.error("パスワードは半角小文字英字と数字を含む8文字以上にしてください");
            return;
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
        </EditUI>
    );
};
