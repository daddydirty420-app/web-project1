"use client";

import styles from "../edit.module.css";
import { InputStr, Button } from "@/components/inputForm";
import EditUI from "../editUI";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Name } from "../type";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    name: Name;
    page: "normal" | "delivery" | "rep-shop" | "rep-shop-signup" | "con-shop" | "con-shop-signup";
    deliveryId?: string;
    shopId?: string;
};

export default function NameEditForm({ name, page, deliveryId, shopId }: Props) {
    const [seiValue, setSeiValue] = useState(name.sei);
    const [meiValue, setMeiValue] = useState(name.mei);
    const [seiKanaValue, setSeiKanaValue] = useState(name.sei_kana);
    const [meiKanaValue, setMeiKanaValue] = useState(name.mei_kana);
    const router = useRouter();

    const submit = async () => {
        if (!seiValue || !meiValue || !seiKanaValue || !meiKanaValue) {
            alert("空の項目があります。");
            return;
        }

        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/name/name-edit/${name.id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    sei: seiValue,
                    mei: meiValue,
                    seiKana: seiKanaValue,
                    meiKana: meiKanaValue,
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
            } else if (page === "con-shop") {
                alert("氏名を変更しました。");
                router.push(`/shop-info/${shopId}`);
            } else if (page === "con-shop-signup") {
                router.push(`/shop-signup/step5/${shopId}`);
            } else {
                alert("氏名を変更しました。");
                router.push("/my-page");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <EditUI title="氏名の設定・変更">
            <div className={styles.nameFlex}>
                <InputStr
                title="姓"
                type="text"
                value={seiValue}
                onChange={setSeiValue}
                placeholder="炭火"
                hissu
                />
                <InputStr
                title="名"
                type="text"
                value={meiValue}
                onChange={setMeiValue}
                placeholder="焼太郎"
                hissu
                />
            </div>

            <div className={styles.nameFlex}>
                <InputStr
                title="セイ"
                type="text"
                value={seiKanaValue}
                onChange={setSeiKanaValue}
                placeholder="スミビ"
                hissu
                />
                <InputStr
                title="メイ"
                type="text"
                value={meiKanaValue}
                onChange={setMeiKanaValue}
                placeholder="ヤキタロウ"
                hissu
                />
            </div>

            <Button onClick={submit}>登録する</Button>
        </EditUI>
    );
};