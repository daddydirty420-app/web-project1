"use client";

import { useState } from "react";
import styles from "../../edit.module.css";
import { ShopInfo } from "../../type";
import { useRouter } from "next/navigation";
import EditUI from "../../editUI";
import { Button, InputStr } from "@/components/inputForm";
import clsx from "clsx";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/getAccessToken";

type Props = {
    shopId: string;
    shopInfo: ShopInfo;
};

export const Form = ({ shopId, shopInfo }: Props) => {
    const [companyName, setCompanyName] = useState(shopInfo.company_name);
    const router = useRouter();

    const comFree = shopInfo.ComOrFreeOption?.id;

    const submit = async () => {
        if (!companyName) {
            toast.error(`${title}を入力してください。`);
            return;
        }

        try {
            const accessToken = await getAccessToken();
        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-info-edit/company-name-edit/${shopId}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ companyName }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error("更新に失敗しました。");
                console.error(data.message);
                return;
            }

            const alertText = comFree === 1
            ? "会社名の変更を受け付けました。審査完了までお待ちください。"
            : "屋号を変更しました。"

            toast.success(`${alertText}`);
            router.push(`/shop-info/${shopId}`);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const title = comFree === 1 ? "会社名" : "屋号";

    const placeholder = comFree === 1 ? "株式会社〇〇" : "〇〇〇〇";

    return (
        <EditUI title={`${title}の変更`}>
            <InputStr
            title={`新しい${title}`}
            type="text"
            value={companyName}
            onChange={setCompanyName}
            placeholder={placeholder}
            hissu
            />

            {comFree === 1 && (
                <p className={clsx(styles.centerSmall, "mt-4")}>※会社名の変更は審査が必要になります。登録される会社名の変更は審査が完了し次第となります。審査には1~2週間ほどお時間を頂戴しております。</p>
            )}

            <Button onClick={submit}>登録する</Button>
        </EditUI>
    );
};