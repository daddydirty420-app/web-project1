"use client";

import { Button, InputStr, Textarea } from "@/components/inputForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAccessToken } from "../../lib/getAccessToken";
import { sleep } from "../../lib/sleep";
import { User } from "./type";

type Props = {
    user?: User;
};

export const Form = ({ user }: Props) => {
    const [name, setName] = useState(user?.user_name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        router.refresh();
    }, []);

    const router = useRouter();

    const submit = async () => {
        const emailTrim = email.trim();

        if (!name || name.trim() === "") {
            toast.error("お名前を入力してください");
            return;
        }

        if (!email || emailTrim === "") {
            toast.error("メールアドレスを入力してください");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailTrim)) {
            toast.error("正しいメールアドレス形式で入力してください");
            return;
        }

        if (!title || title.trim() === "") {
            toast.error("件名を入力してください");
            return;
        }

        if (!body || body.trim() === "") {
            toast.error("本文を入力してください");
            return;
        }

        try {
            setLoading(true);

            const accessToken = await getAccessToken();
            console.log("accessToken:", accessToken); 

            console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiry`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                },
                body: JSON.stringify({
                    name,
                    email: emailTrim,
                    title,
                    body,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setLoading(false);
                toast.error("お問い合わせ内容の送信に失敗しました");
                console.error(data.message);
                return;
            }

            toast.success("お問い合わせ内容を送信しました！");
            console.log(data.message);

            await sleep(1500);

            setLoading(false);
            router.back();
        } catch (err) {
            setLoading(false);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <>
            <InputStr title="お名前" type="text" value={name || ""} onChange={setName} placeholder="お名前" hissu />

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
                placeholder="件名（最大50文字まで）"
                maxLength={50}
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

            <Button onClick={submit}>{loading ? "送信中..." : "送信する"}</Button>
        </>
    );
};
