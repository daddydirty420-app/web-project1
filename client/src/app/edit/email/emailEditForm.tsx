"use client";

import styles from "../edit.module.css";
import { InputStr, Button } from "@/components/inputForm";
import EditUI from "../editUI";
import { useState } from "react";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/getAccessToken";

type Props = {
    session: Session | null;
};

export const EmailEditForm = ({ session }: Props) => {
    const [value, setValue] = useState(session?.user.email || "");

    const submit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            toast.error("正しいメールアドレスの形式で入力してください。");
            return;
        }
        
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/email-edit`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    email: value,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error("メールアドレスの変更に失敗しました。");
                console.error(data.message);
                return;
            }

            toast.success(data.message);
            setValue("");
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <EditUI title="メールアドレスの設定・変更">
            <InputStr
            title="新しいメールアドレス"
            type="email"
            value={value}
            onChange={setValue}
            placeholder="*****@****.***"
            hissu
            />

            <Button onClick={submit}>登録する</Button>

            <p className={styles.textBottomSmall}>※ボタンをクリックすると、新しいメールアドレスに本登録URLを記載したメールを送信いたします。こちらのページでメールアドレスの変更が完了するわけではございません。</p>
        </EditUI>
    );
};