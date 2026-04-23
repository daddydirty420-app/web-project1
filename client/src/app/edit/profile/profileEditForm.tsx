"use client";

import { Button, InputStr, Textarea } from "@/components/inputForm";
import { getAccessToken } from "@/lib/getAccessToken";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import EditUI from "../editUI";
import { User } from "../type";
import { ProfileImage } from "./profileImage";

type Props = {
    user: User;
};

export const ProfileEditForm = ({ user }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [userNameValue, setUserNameValue] = useState(user.user_name);
    const [introductionValue, setIntroductionValue] = useState(user.user_introduction);
    const [defaultImage, setDefaultImage] = useState(false);
    const router = useRouter();

    const submit = async () => {
        if (!userNameValue) {
            toast.error("必須項目が空になっています。");
            return;
        }

        const query = file || defaultImage ? "?imageEdit=true" : "";

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-edit/profile-update${query}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
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
                toast.error("プロフィールの変更に失敗しました。");
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
                    toast.error("プロフィール画像のS3アップロードに失敗しました。");
                    return;
                }
            }

            router.push(`/profile/${user.id}`);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
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
