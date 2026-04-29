"use client";

import { Button, InputStr } from "@/components/inputForm";
import { getAccessToken } from "@/lib/getAccessToken";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { sleep } from "../../../lib/sleep";
import EditUI from "../editUI";
import { User } from "../type";

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
            toast.error("電話番号は半角数字のみで入力してください");
            return;
        }
        if (!value) {
            toast.error("電話番号を入力してください");
            return;
        }

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください");
                return;
            }

            if (page === "shop") {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-info/${shopId}/phone-number`, {
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
                    toast.error("電話番号の更新に失敗しました");
                    return;
                }

                toast.success("電話番号を更新しました");
                await sleep(1500);

                router.push(`/shop-info/${shopId}`);
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/phone-number`, {
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
                toast.error("電話番号の更新に失敗しました");
                return;
            }

            toast.success("電話番号を更新しました");
            await sleep(1500);

            if (page === "delivery") {
                router.push(`/buy/trans/${deliveryId}`);
            } else {
                router.push("/my-page");
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください");
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
