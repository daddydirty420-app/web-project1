"use client";

import styles from "../ss.module.css";
import SSUI from "../ssUI";
import { StepBar } from "../stepBar";
import { ButtonDiv } from "../buttonDiv";
import { ShopInfo } from "../type";
import React, { useRef, useState } from "react";
import { InputTitle } from "@/components/inputForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/getAccessToken";

type Props = {
    shopId: string;
    shopInfo: ShopInfo;
};

type PermitImage = {
    uploaded: boolean;
    file: File | null;
    preview: string;
};

export const Form = ({ shopId, shopInfo }: Props) => {
    const [idCardFront, setIdCardFront] = useState<File | string | undefined>(shopInfo.id_card_front ?? "");
    const [idFrontPreview, setIdFrontPreview] = useState(shopInfo.id_card_front ?? "");
    const [idFrontUpload, setIdFrontUpload] = useState<boolean>(false);

    const [idCardRear, setIdCardRear] = useState<File | string | undefined>(shopInfo.id_card_rear ?? "");
    const [idRearPreview, setIdRearPreview] = useState(shopInfo.id_card_rear ?? "");
    const [idRearUpload, setIdRearUpload] = useState<boolean>(false);

    const [checked, setChecked] = useState(false);

    const initialPermit = (shopInfo.permit_url ?? []).map((url) => ({
        file: null,
        preview: url,
        uploaded: false,
    }));

    const [permitImages, setPermitImages] = useState<PermitImage[]>(initialPermit);

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

    const handlePermitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);

        const newImages = files.slice(0, 10 - permitImages.length).map(f => ({
            file: f,
            preview: URL.createObjectURL(f),
            uploaded: true,
        }));

        setPermitImages(prev => [...prev, ...newImages]);
    };

    const removePermitImage = (index: number) => {
        setPermitImages(prev => prev.filter((_, i) => i !== index));
    };

    const submit = async () => {
        if (!idCardFront || !idCardRear) {
            toast.error("身分証がアップロードされていません。");
            return;
        }

        if (checked && permitImages.length === 0) {
            toast.error("許認可証がアップロードされていません。");
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

        let permitFiles: ({ fileName: string; fileType: string | null; uploaded: boolean } | undefined)[] = [];
        if (checked) {
            permitFiles = permitImages.map(img => {
                if (img.uploaded && img.file instanceof File) {
                    return {
                        fileName: img.file!.name,
                        fileType: img.file!.type,
                        uploaded: true,
                    };
                }

                const fileName = (img.preview ?? "").split("/").pop() || "unknown";

                return {
                    fileName,
                    fileType: null,
                    uploaded: false,
                }
            });
        }

        const body = {
            frontFileName,
            frontFileType,
            rearFileName,
            rearFileType,
            idFrontUpload,
            idRearUpload,
            permitFiles,
        };

        try {
            const accessToken = await getAccessToken();
        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup-create/3/${shopId}`, {
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
                toast.error("画像データの送信に失敗しました。");
                return;
            }

            if (idFrontUpload && data.frontSignedUrl && idCardFront instanceof File) {
                const uploadFrontRes = await fetch(data.frontSignedUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": idCardFront.type,
                    },
                    body: idCardFront,
                });

                if (!uploadFrontRes.ok) {
                    toast.error("身分証（表面）のアップロードに失敗しました。");
                    return;
                }
            }

            if (idRearUpload && data.rearSignedUrl && idCardRear instanceof File) {
                const uploadFrontRes = await fetch(data.rearSignedUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": idCardRear.type,
                    },
                    body: idCardRear,
                });

                if (!uploadFrontRes.ok) {
                    toast.error("身分証（裏面）のアップロードに失敗しました。");
                    return;
                }
            }

            if (checked) {
                const uploadImages = permitImages.filter(img => img.uploaded && img.file instanceof File);

                for (let i = 0; i < data.permitSignedUrls.length; i++) {
                    const file = uploadImages[i].file!;
                    const signedUrl = data.permitSignedUrls[i];

                    const upload = await fetch(signedUrl, {
                        method: "PUT",
                        headers: {
                            "Content-Type": file.type,
                        },
                        body: file,
                    });

                    if (!upload.ok) {
                        toast.error("許認可証のアップロードに失敗しました。");
                        return;
                    }
                }
            }

            router.push(`/shop-signup/step4/${shopId}`);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const backSubmit = () => router.push(`/shop-signup/step2/${shopId}`);

    return (
        <SSUI title="代表者身分証・許認可証登録">
            <StepBar />

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
            </div>

            <label className={styles.checkLabel}>
                <input
                type="checkbox"
                name="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
                className={styles.check}
                />
                <p className={styles.checkText}>許認可が必要な事業内容ですか？</p>
            </label>

            {checked && (
                <section className={styles.permitSecton}>
                    <h2 className={styles.subtitle}>許認可証アップロード</h2>

                    <div className={styles.imageInputDivPermit}>
                        <InputTitle title="許認可証（最大10枚まで）" />
                        <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePermitChange}
                        disabled={permitImages.length >= 10}
                        className={styles.imageInputPermit}
                        placeholder="画像ファイルをアップロード"
                        required
                        />
                    </div>

                    <div className={styles.permitListDiv}>
                        {permitImages.map((img, index) => (
                            <div key={index} className={styles.permitPreviewItem}>
                                <Image
                                src={img.preview}
                                alt={`permit-${index}`}
                                width={100}
                                height={100}
                                className={styles.permitPreview}
                                />

                                <FontAwesomeIcon
                                icon={faTrashCan}
                                onClick={() => removePermitImage(index)}
                                className={styles.permitRemoveIcon}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <ButtonDiv nextClick={submit} backClick={backSubmit} />
        </SSUI>
    );
};