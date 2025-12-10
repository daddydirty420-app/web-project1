"use client";

import { InputStr, Button } from "@/components/inputForm";
import EditUI from "../editUI";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../type";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    user: User;
    page: "normal" | "delivery" | "shop" | "shop-signup";
    deliveryId?: string;
    shopId?: string;
};

export default function PhoneNumberEdit({ user, page, deliveryId, shopId }: Props) {
    const [value, setValue] = useState(user.phone_number);
    const router = useRouter();

    const submit = async () => {
        if (!/^[0-9]+$/.test(value)) {
            alert("電話番号は半角数字のみで入力してください。");
            return;
        }
        if (!value) {
            alert("電話番号を入力してください。");
            return;
        }
        
        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-edit/phone-number-edit`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    phoneNumber: value,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                alert("サーバーエラーが発生しました。通信環境を確認し、もう一度ボタンをクリックしてください。");
                return;
            }

            if (page === "delivery") {
                router.push(`/buy/trans/${deliveryId}`);
            } else if (page === "shop") {
                router.push(`/shop-info/${shopId}`);
            } else if (page === "shop-signup") {
                router.push(`/shop-signup/step5/${shopId}`);
            } else {
                alert("電話番号を変更しました。");
                router.push("/my-page");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <EditUI title="電話番号の設定・変更">
            <InputStr
            title="電話番号"
            type="tel"
            value={value}
            onChange={setValue}
            placeholder="電話番号"
            hissu
            patternNum
            />
            
            <Button onClick={submit}>登録する</Button>
        </EditUI>
    );
};