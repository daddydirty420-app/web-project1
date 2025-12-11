"use client";

import styles from "../edit.module.css";
import { InputStr, Button, InputTitle } from "@/components/inputForm";
import EditUI from "../editUI";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Name } from "../type";
import { refreshToken } from "@/lib/refreshToken";
import Image from "next/image";
import clsx from "clsx";

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

    const [idCardFront, setIdCardFront] = useState<File | string | undefined>("");
    const [idFrontPreview, setIdFrontPreview] = useState("");
    const [idFrontUpload, setIdFrontUpload] = useState<boolean>(false);
        
    const [idCardRear, setIdCardRear] = useState<File | string | undefined>("");
    const [idRearPreview, setIdRearPreview] = useState("");
    const [idRearUpload, setIdRearUpload] = useState<boolean>(false);
    
    const idFrontRef = useRef<HTMLInputElement | null>(null);
    const idRearRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();
    
    const handleChangeFront = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setIdCardFront(selectedFile);
            setIdFrontPreview(URL.createObjectURL(selectedFile));
            setIdFrontUpload(true);
        }
    };
    
    const handleChangeRear = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setIdCardRear(selectedFile);
            setIdRearPreview(URL.createObjectURL(selectedFile));
            setIdRearUpload(true);
        }
    };

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

    const repSubmit = async () => {
        if (!seiValue || !meiValue || !seiKanaValue || !meiKanaValue) {
            alert("空の項目があります。");
            return;
        }

        if (!idCardFront || !idCardRear) {
            alert("身分証がアップロードされていません。");
            return;
        }

        let frontFileName: string | undefined;
        let frontFileType: string | undefined;
        let rearFileName: string | undefined;
        let rearFileType: string | undefined;

        if (idFrontUpload && idCardFront instanceof File) {
            frontFileName = idCardFront.name;
            frontFileType = idCardFront.type;
        }

        if (idRearUpload && idCardRear instanceof File) {
            rearFileName = idCardRear.name;
            rearFileType = idCardRear.type;
        }

        const body = {
            seiValue,
            meiValue,
            seiKanaValue,
            meiKanaValue,
            frontFileName,
            frontFileType,
            rearFileName,
            rearFileType,
            idFrontUpload,
            idRearUpload,
        };

        try {
            const accessToken = await refreshToken();
                
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            if (page === "rep-shop") {

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-info-edit/rep-name-edit/${shopId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(body),
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error(data.message);
                    alert("サーバーエラーが発生しました。通信環境を確認し、もう一度ボタンをクリックしてください。");
                    return;
                }
                alert("代表者氏名の変更を受け付けました。審査完了までしばらくお待ちください。");
                router.push(`/shop-info/${shopId}`);

            } else if (page === "rep-shop-signup") {

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup-create/rep-name-edit/${shopId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(body),
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error(data.message);
                    alert("サーバーエラーが発生しました。通信環境を確認し、もう一度ボタンをクリックしてください。");
                    return;
                }

                router.push(`/shop-signup/step5/${shopId}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    let title = "氏名の設定・変更";
    if (page === "rep-shop" || "rep-shop-signup") {
        title = "代表者氏名の設定・変更";
    } else if (page === "con-shop" || "con-shop-signup") {
        title = "ショップ担当者氏名の設定・変更";
    }

    const submitOption = (page === "rep-shop" || "rep-shop-signup")
    ? repSubmit : submit;

    return (
        <EditUI title={title}>
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

            {(page === "rep-shop" || "rep-shop-signup") && (
                <>
                <h2 className={styles.subtitle}>代表者身分証</h2>

                <div className={styles.imageInputDiv}>
                    <InputTitle title="身分証（表面）" hissu />
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleChangeFront}
                    className={styles.imageInput}
                    placeholder="画像ファイルをアップロード"
                    ref={idFrontRef}
                    />
                    <Image
                    src={idFrontPreview || "/no-image(1x1).png"}
                    alt="身分証（表面）"
                    width={120}
                    height={120}
                    className={styles.preview}
                    />

                    <InputTitle title="身分証（裏面）" hissu />
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleChangeRear}
                    className={styles.imageInput}
                    placeholder="画像ファイルをアップロード"
                    ref={idRearRef}
                    required
                    />
                    <Image
                    src={idRearPreview || "/no-image(1x1).png"}
                    alt="身分証（裏面）"
                    width={120}
                    height={120}
                    className={styles.preview}
                    />

                    <p className={styles.centerSmall}>※顔写真付きのもの
                        <br />※顔写真と生年月日がわかる面を表にして撮影
                        <br />※表裏合わせて計2枚撮影
                    </p>

                    <p className={clsx(styles.centerSmall, "mt-4")}>※代表者氏名の変更は審査が必要になります。登録される代表者氏名の変更は審査が完了し次第となります。審査には1~2週間ほどお時間を頂戴しております。</p>
                </div>
            </>
            )}

            <Button onClick={submitOption}>登録する</Button>
        </EditUI>
    );
};