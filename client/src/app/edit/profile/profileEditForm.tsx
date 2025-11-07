"use client";

import { InputStr, Button, Textarea } from "@/components/inputForm";
import EditUI from "../editUI";
import { useState } from "react";
import { Session } from "next-auth";
import { User } from "../type";
import ProfileImage from "./profileImage";
import { useRouter } from "next/navigation";

type Props = {
    session: Session | null;
    user: User;
};

export default function ProfileEditForm({ session, user }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [userNameValue, setUserNameValue] = useState(user.user_name);
    const [introductionValue, setIntroductionValue] = useState(user.user_introduction);
    const [defaultImage, setDefaultImage] = useState(false);
    const router = useRouter();

    const submit = async () => {
        try {
            if (!userNameValue) {
                alert("必須項目が空になっています。");
                return;
            }
            
            const query = (file || defaultImage) ? "?imageEdit=true" : "";

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-edit/profile-update${query}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${session?.accessToken ?? ""}`,
                },
                body: JSON.stringify({
                    fileName: file?.name,
                    contentType: file?.type,
                    userName: userNameValue,
                    introduction: introductionValue,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                alert("サーバーエラーが発生しました。通信環境を確認し、もう一度ボタンをクリックしてください。");
                return;
            }

            if (file && data.signedUrl) {
                const uploadRes = await fetch(data.signedUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                });

                if (!uploadRes.ok) {
                    console.error("プロフィール画像のS3アップロードに失敗しました。");
                    return;
                }
            }

            router.push("/my-page");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <EditUI title="プロフィール設定">
            <ProfileImage user={user} setFile={setFile} defaultImage={defaultImage} setDefaultImage={setDefaultImage} />
            <InputStr
            title="ユーザーネーム"
            type="text"
            value={userNameValue}
            onChange={setUserNameValue}
            placeholder="ユーザーネーム"
            hissu
            />
            <Textarea
            title="自己紹介"
            value={introductionValue}
            onChange={setIntroductionValue}
            placeholder="年齢・地域・趣味・欲しい物など（300文字以内）"
            maxLength={300}
            />
            <Button onClick={submit}>変更する</Button>
        </EditUI>
    );
};