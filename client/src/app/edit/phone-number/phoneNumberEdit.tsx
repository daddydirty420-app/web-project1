"use client";

import { Button, InputStr } from "@/components/inputForm";
import { getAccessToken } from "@/lib/getAccessToken";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../../lib/api/apiError";
import { sleep } from "../../../lib/sleep";
import { fetchPhoneNumberEdit, fetchShopPhoneNumberEdit } from "../api/phoneNumber";
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
                if (!shopId) throw new Error();

                await fetchShopPhoneNumberEdit(shopId, value);

                toast.success("電話番号を更新しました");
                await sleep(1500);

                router.push(`/shop-info/${shopId}`);
                return;
            }

            await fetchPhoneNumberEdit(value);

            toast.success("電話番号を更新しました");
            await sleep(1500);

            if (page === "delivery") {
                router.push(`/buy/trans/${deliveryId}`);
            } else {
                router.push("/my-page");
            }
        } catch (err) {
            if (err instanceof ApiError) {
                toast.error("電話番号の更新に失敗しました");
                return;
            }

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
