"use client";

import styles from "../edit.module.css";
import { InputStr, Button, InputTitle } from "@/components/inputForm";
import EditUI from "../editUI";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Name } from "../type";
import Image from "next/image";
import clsx from "clsx";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/getAccessToken";

type Props = {
    name: Name;
    page:
        | "normal"
        | "delivery"
        | "rep-shop"
        | "rep-shop-signup"
        | "rep-com-free"
        | "con-shop"
        | "con-shop-signup"
        | "con-com-free";
    deliveryId?: string;
    shopId?: string;
    shopEditId?: string;
};

export const NameEditForm = ({ name, page, deliveryId, shopId, shopEditId }: Props) => {
    const [seiValue, setSeiValue] = useState(name?.sei ?? "");
    const [meiValue, setMeiValue] = useState(name?.mei ?? "");
    const [seiKanaValue, setSeiKanaValue] = useState(name?.sei_kana ?? "");
    const [meiKanaValue, setMeiKanaValue] = useState(name?.mei_kana ?? "");

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
            toast.error("空の項目があります。");
            return;
        }

        try {
            const accessToken = await getAccessToken();

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
                toast.error("氏名の変更に失敗しました。");
                return;
            }

            if (page === "delivery") {
                router.push(`/buy/trans/${deliveryId}`);
            } else if (page === "con-shop") {
                toast.success("氏名を変更しました。");
                router.push(`/shop-info/${shopId}`);
            } else if (page === "con-shop-signup") {
                router.push(`/shop-signup/step5/${shopId}`);
            } else if (page === "rep-com-free" || page === "con-com-free") {
                router.push(`/edit/shop/com-free/confirm/${shopEditId}`);
            } else {
                toast.success("氏名を変更しました。");
                router.push("/my-page");
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const repSubmit = async () => {
        if (!seiValue || !meiValue || !seiKanaValue || !meiKanaValue) {
            toast.error("空の項目があります。");
            return;
        }

        if (!idCardFront || !idCardRear) {
            toast.error("身分証がアップロードされていません。");
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
            const accessToken = await getAccessToken();

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
                    toast.error("氏名の変更に失敗しました。");
                    return;
                }
                toast.success("代表者氏名の変更を受け付けました。審査完了までしばらくお待ちください。");
                router.push(`/shop-info/${shopId}`);
            } else if (page === "rep-shop-signup") {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/shop-signup-create/rep-name-edit/${shopId}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(body),
                    },
                );

                const data = await res.json();

                if (!res.ok) {
                    console.error(data.message);
                    alert("氏名の変更に失敗しました。");
                    return;
                }

                router.push(`/shop-signup/step5/${shopId}`);
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    let title = "氏名の設定・変更";
    if (page === "rep-shop" || page === "rep-shop-signup" || page === "rep-com-free") {
        title = "代表者氏名の設定・変更";
    } else if (page === "con-shop" || page === "con-shop-signup" || page === "con-com-free") {
        title = "ショップ担当者氏名の設定・変更";
    }

    const submitOption = page === "rep-shop" || page === "rep-shop-signup" ? repSubmit : submit;

    return (
        <EditUI title={title}>
            <div className={styles.nameFlex}>
                <InputStr title="姓" type="text" value={seiValue} onChange={setSeiValue} placeholder="山田" hissu />
                <InputStr title="名" type="text" value={meiValue} onChange={setMeiValue} placeholder="太郎" hissu />
            </div>

            <div className={styles.nameFlex}>
                <InputStr
                    title="セイ"
                    type="text"
                    value={seiKanaValue}
                    onChange={setSeiKanaValue}
                    placeholder="ヤマダ"
                    hissu
                />
                <InputStr
                    title="メイ"
                    type="text"
                    value={meiKanaValue}
                    onChange={setMeiKanaValue}
                    placeholder="タロウ"
                    hissu
                />
            </div>

            {(page === "rep-shop" || page === "rep-shop-signup") && (
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

                        <p className={styles.centerSmall}>
                            ※顔写真付きのもの
                            <br />
                            ※顔写真と生年月日がわかる面を表にして撮影
                            <br />
                            ※表裏合わせて計2枚撮影
                        </p>
                    </div>

                    <p className={clsx(styles.centerSmall, "mt-4")}>
                        ※代表者氏名の変更は審査が必要になります。登録される代表者氏名の変更は審査が完了し次第となります。審査には1~2週間ほどお時間を頂戴しております。
                    </p>
                </>
            )}

            <Button onClick={submitOption}>登録する</Button>
        </EditUI>
    );
};
