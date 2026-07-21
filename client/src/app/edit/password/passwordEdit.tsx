"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

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
};
