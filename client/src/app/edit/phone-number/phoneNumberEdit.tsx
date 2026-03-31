"use client";

import { InputStr, Button } from "@/components/inputForm";
import EditUI from "../editUI";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../type";
import { refreshToken } from "@/lib/refreshToken";
import toast from "react-hot-toast";

type Props = {
    user: User;
    page: "normal" | "delivery" | "shop";
    deliveryId?: string;
    shopId?: string;
};

export const PhoneNumberEdit = ({ user, page, deliveryId, shopId }: Props) => {
    const [value, setValue] = useState(user.phone_number);
    const router = useRouter();

    const submit = async () => {
        if (!/^[0-9]+$/.test(value)) {
            toast.error("電話番号は半角数字のみで入力してください。");
            return;
        }
        if (!value) {
            toast.error("電話番号を入力してください。");
            return;
        }
        
        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            if (page === "shop") {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-info-edit/phone-number-edit/${shopId}`, {
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
                    toast.error("電話番号の変更に失敗しました。");
                    return;
                }

                toast.success("電話番号を変更しました。");
                router.push(`/shop-info/${shopId}`);
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
                toast.error("電話番号の変更に失敗しました。");
                return;
            }

            if (page === "delivery") {
                router.push(`/buy/trans/${deliveryId}`);
            } else {
                toast.success("電話番号を変更しました。");
                router.push("/my-page");
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
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