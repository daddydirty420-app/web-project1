"use client";

import { Button, InputStr } from "@/components/inputForm";
import { Session } from "next-auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../../lib/api/apiError";
import { fetchEmailEdit } from "../api/email/client";
import styles from "../edit.module.css";
import EditUI from "../editUI";

type Props = {
    session: Session | null;
};

export const EmailEditForm = ({ session }: Props) => {
    const [value, setValue] = useState(session?.user.email || "");

    const submit = async () => {
        const trimEmail = value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimEmail)) {
            toast.error("正しいメールアドレスの形式で入力してください");
            return;
        }

        if (trimEmail === session?.user.email) {
            toast.error("現在と異なるメールアドレスを入力してください");
            return;
        }

        try {
            await fetchEmailEdit(trimEmail);

            toast.success("新しいメールアドレスにメールを送信しました");
            setValue("");
        } catch (err) {
            if (err instanceof ApiError) {
                switch (err.code) {
                    case "INVALID_EMAIL":
                        toast.error("現在と異なるメールアドレスを入力してください");
                        break;
                    case "ALREADY_USED_EMAIL":
                        toast.error("このメールアドレスは既に使用されています");
                        break;
                    default:
                        toast.error("メールアドレスの変更に失敗しました");
                }
                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください。");
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

            <p className={styles.textBottomSmall}>
                ※ボタンをクリックすると、新しいメールアドレスに本登録URLを記載したメールを送信いたします。メールが送信されない場合、再度新しいメールアドレスを入力して登録するボタンを押してください。
            </p>
        </EditUI>
    );
};
