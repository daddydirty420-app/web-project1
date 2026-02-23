"use client"

import { useState } from "react";
import { User } from "./type";
import { Button, InputStr, Textarea } from "@/components/inputForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
    loggedIn: boolean;
    user?: User;
};

export const Form = ({ loggedIn, user }: Props) => {
    const [name, setName] = useState(user?.user_name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const router = useRouter();

    const submit = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiry/user-submit${loggedIn ? `?userId=${user?.id ?? ""}` : ""}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    title,
                    body
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error("お問い合わせ内容の送信に失敗しました");
                console.error(data.message);
                return;
            }

            toast.success("お問い合わせ内容を送信しました！");
            console.log(data.message);
            router.back();
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <>
        <InputStr
        title="お名前"
        type="text"
        value={name || ""}
        onChange={setName}
        placeholder="お名前"
        hissu
        />

        <InputStr
        title="メールアドレス"
        type="text"
        value={email || ""}
        onChange={setEmail}
        placeholder="****@*****.***"
        hissu
        />

        <InputStr
        title="件名"
        type="text"
        value={title || ""}
        onChange={setTitle}
        placeholder="件名"
        hissu
        />

        <Textarea
        title="お問い合わせ内容"
        value={body || ""}
        onChange={setBody}
        maxLength={500}
        placeholder="お問い合わせ内容（最大500文字まで）"
        hissu
        />

        <Button onClick={submit}>送信する</Button>
        </>
    );
};