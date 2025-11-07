"use client";

import styles from "../edit.module.css";
import { InputStr, Button } from "components/inputForm";
import EditUI from "../editUI";
import { useState } from "react";
import { Session } from "next-auth";

type Props = {
    session: Session | null;
};

export default function EmailEditForm({ session }: Props) {
    const [value, setValue] = useState(session?.user.email || "");

    const submit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            alert("正しいメールアドレスの形式で入力してください。");
            return;
        }
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/email-edit`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${session?.accessToken ?? ""}`,
                },
                body: JSON.stringify({
                    email: value,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert(data.message);
            setValue("");
        } catch (err) {
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