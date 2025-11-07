"use client";

import { InputStr, Button } from "components/inputForm";
import EditUI from "../editUI";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Address } from "../type";

type Props = {
    session: Session | null;
    address: Address;
    page: "normal" | "delivery";
    deliveryId?: string;
};

export default function AddressEditForm({ session, address, page, deliveryId }: Props) {
    const [postNumber, setPostNumber] = useState(address.post_number);
    const [todouhuken, setTodouhuken] = useState(address.AddressTodouhuken.name);
    const [shikutyouson, setShikutyouson] = useState(address.shikutyouson);
    const [banchi, setBanchi] = useState(address.banchi);
    const [building, setBuilding] = useState(address.building);
    const router = useRouter();

    useEffect(() => {
        if (postNumber.length === 7) {
            handleZipSearch();
        }
    }, [postNumber]);

    const handleZipSearch = async () => {
        if (!postNumber || postNumber.length < 7) {
            alert("7桁の郵便番号を入力してください。");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/address/get-address?zipcode=${postNumber}`, {
                method: "GET",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                alert("サーバーエラーが発生しました。通信環境を確認し、もう一度ボタンをクリックしてください。");
            };

            setTodouhuken(data.address.todouhuken_name);
            setShikutyouson(data.address.shikutyouson);
            setBanchi(data.address.banchi);
        } catch (err) {
            console.error(err);
        }
    };

    const submit = async () => {
        if (!postNumber || !todouhuken || !shikutyouson || !banchi) {
            alert("必須項目が空になっています。");
            return;
        }

        const normalizedPostNumber = postNumber.replace(/-/g, "");
        if (!/^[0-9]{7}$/.test(normalizedPostNumber)) {
            alert("郵便番号は半角数字7桁で入力してください。");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/address/address-edit/${address.id}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${session?.accessToken ?? ""}`,
                },
                body: JSON.stringify({
                    postNumber,
                    todouhuken,
                    shikutyouson,
                    banchi,
                    building,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                return;
            }

            if (page === "delivery") {
                router.push(`/buy/trans/${deliveryId}`);
            } else {
                alert("住所を変更しました。");
                router.push("/my-page");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <EditUI title="住所の設定・変更">
            <InputStr
            title="郵便番号 ※ハイフン無し"
            type="text"
            value={postNumber}
            onChange={setPostNumber}
            placeholder="0000000（ハイフン無し、半角）"
            hissu
            numeric
            patternNum
            />
            <InputStr
            title="都道府県"
            type="text"
            value={todouhuken}
            onChange={setTodouhuken}
            placeholder="〇〇県"
            hissu
            />
            <InputStr
            title="市区町村"
            type="text"
            value={shikutyouson}
            onChange={setShikutyouson}
            placeholder="〇〇市"
            hissu
            />
            <InputStr
            title="町名・番地"
            type="text"
            value={banchi}
            onChange={setBanchi}
            placeholder="〇-〇〇"
            hissu
            />
            <InputStr
            title="建物名・部屋番号"
            type="text"
            value={building}
            onChange={setBuilding}
            placeholder="〇〇マンション××号室"
            hissu={false}
            />

            <Button onClick={submit}>登録する</Button>
        </EditUI>
    );
};