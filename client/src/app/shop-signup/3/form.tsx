"use client";

import styles from "../ss.module.css";
import SSUI from "../ssUI";
import StepBar from "../stepBar";
import ButtonDiv from "../buttonDiv";
import { ShopInfo } from "../type";
import React, { useRef, useState } from "react";
import { InputTitle } from "@/components/inputForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

type Props = {
    shopId: string;
    shopInfo: ShopInfo;
};

type PermitImage = {
    file: File | null;
    preview: string;
};

export default function Form({ shopId, shopInfo }: Props) {
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
        }));

        setPermitImages(prev => [...prev, ...newImages]);
    };

    const removePermitImage = (index: number) => {
        setPermitImages(prev => prev.filter((_, i) => i !== index));
    };

    const submit = async () => {};

    const backSubmit = () => router.push(`/shop-signup/2/${shopId}`);

    return (
        <SSUI title="身分証・許認可証登録">
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

            <label className={styles.checkbox}>
                <input
                type="checkbox"
                name="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
                className="cursor-pointer"
                />
                許認可が必要な事業内容ですか？
            </label>

            {checked && (
                <section className={styles.permitSecton}>
                    <h2 className={styles.subtitle}>許認可証アップロード</h2>

                    <div className={styles.imageInputDiv}>
                        <InputTitle title="許認可証（最大10枚まで）" />
                        <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePermitChange}
                        disabled={permitImages.length >= 10}
                        className={styles.imageInput}
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