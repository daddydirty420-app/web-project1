"use client";

import styles from "../edit.module.css";
import { InputStr, Button, InputTitle } from "@/components/inputForm";
import EditUI from "../editUI";
import { GenderOption, User } from "../type";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { ja } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    user: User;
    genderOptions: GenderOption[];
    campaign?: boolean;
};

export default function HonninEditForm({ user, genderOptions, campaign }: Props) {
    const [sei, setSei] = useState(user.Name?.sei);
    const [mei, setMei] = useState(user.Name?.mei);
    const [seiKana, setSeiKana] = useState(user.Name?.sei_kana);
    const [meiKana, setMeiKana] = useState(user.Name?.mei_kana);

    const [birthday, setBirthday] = useState<Date | null>(user.birthday);

    const [idCardFront, setIdCardFront] = useState<File | string | undefined>(user.IdCard?.id_card_front);
    const [idFrontPreview, setIdFrontPreview] = useState(user.IdCard?.id_card_front);
    const [idFrontUpload, setIdFrontUpload] = useState<boolean>(false);
    const [idCardRear, setIdCardRear] = useState<File | string | undefined>(user.IdCard?.id_card_rear);
    const [idRearPreview, setIdRearPreview] = useState(user.IdCard?.id_card_rear);
    const [idRearUpload, setIdRearUpload] = useState<boolean>(false);

    const [postNumber, setPostNumber] = useState(user.Address?.post_number);
    const [todouhuken, setTodouhuken] = useState(user.Address?.AddressTodouhuken.name);
    const [shikutyouson, setShikutyouson] = useState(user.Address?.shikutyouson);
    const [banchi, setBanchi] = useState(user.Address?.banchi);
    const [building, setBuilding] = useState(user.Address?.building);

    const [phoneNumber, setPhoneNumber] = useState(user.phone_number);

    const [selectedGender, setSelectedGender] = useState(user.GenderOption?.id);

    const router = useRouter();

    const idFrontRef = useRef<HTMLInputElement | null>(null);
    const idRearRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (postNumber && postNumber.length === 7) {
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
        const normalizedPostNumber = postNumber?.replace(/-/g, "");
        if (!/^[0-9]{7}$/.test(normalizedPostNumber || "")) {
            alert("郵便番号は半角数字7桁で入力してください。");
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
            sei,
            mei,
            seiKana,
            meiKana,
            birthday,
            postNumber,
            todouhuken,
            shikutyouson,
            banchi,
            building,
            phoneNumber,
            selectedGender,
            frontFileName,
            frontFileType,
            rearFileName,
            rearFileType,
            idFrontUpload,
            idRearUpload,
        };

        const requiredBody = [
            sei,
            mei,
            seiKana,
            meiKana,
            birthday,
            postNumber,
            todouhuken,
            shikutyouson,
            banchi,
            phoneNumber,
            selectedGender,
            idFrontUpload,
            idRearUpload,
        ]

        const hasFrontImage = !!(idCardFront || frontFileName);
        const hasRearImage = !!(idCardRear || rearFileName);

        if (requiredBody.some(v => v === "" || v === undefined || v === null) || !hasFrontImage || !hasRearImage) {
            alert("未入力の必須項目があります。");
            return;
        }

        try {
            const accessToken = await refreshToken();

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-edit/honnin-submit`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken ?? ""}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                alert("サーバーエラーが発生しました。通信環境を確認し、もう一度ボタンをクリックしてください。");
                console.error(data.message)
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
                    console.error("身分証（表面）のアップロードに失敗しました。");
                    alert("身分証（表面）のアップロードに失敗しました。");
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
                    console.error("身分証（裏面）のアップロードに失敗しました。");
                    alert("身分証（裏面）のアップロードに失敗しました。");
                    return;
                }
            }

            alert("本人確認情報を送信しました。");
            router.push("/my-page");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <EditUI title="本人確認情報入力">
            <div className={styles.nameFlex}>
                <InputStr
                title="姓"
                type="text"
                value={sei || ""}
                onChange={setSei}
                placeholder="炭火"
                hissu
                />
                <InputStr
                title="名"
                type="text"
                value={mei || ""}
                onChange={setMei}
                placeholder="焼太郎"
                hissu
                />
            </div>

            <div className={styles.nameFlex}>
                <InputStr
                title="セイ"
                type="text"
                value={seiKana || ""}
                onChange={setSeiKana}
                placeholder="スミビ"
                hissu
                />
                <InputStr
                title="メイ"
                type="text"
                value={meiKana || ""}
                onChange={setMeiKana}
                placeholder="ヤキタロウ"
                hissu
                />
            </div>

            <div className={styles.inputDiv}>
                <InputTitle title="生年月日" hissu />

                <DatePicker
                selected={birthday}
                onChange={(date) => setBirthday(date)}
                dateFormat="yyyy年MM月dd日"
                locale={ja}
                placeholderText="生年月日を選択"
                className={styles.input}
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                required
                />
            </div>

            <div className={styles.imageInputDiv}>
                <InputTitle title="身分証（表面）" hissu />
                <input
                type="file"
                accept="image/*"
                onChange={handleChangeFront}
                className={styles.imageInput}
                placeholder="プロフィール画像をアップロード"
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
                placeholder="プロフィール画像をアップロード"
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

            <InputStr
            title="郵便番号 ※ハイフン無し"
            type="text"
            value={postNumber || ""}
            onChange={setPostNumber}
            placeholder="0000000（ハイフン無し、半角）"
            hissu
            numeric
            patternNum
            />
            <InputStr
            title="都道府県"
            type="text"
            value={todouhuken || ""}
            onChange={setTodouhuken}
            placeholder="〇〇県"
            hissu
            />
            <InputStr
            title="市区町村"
            type="text"
            value={shikutyouson || ""}
            onChange={setShikutyouson}
            placeholder="〇〇市"
            hissu
            />
            <InputStr
            title="町名・番地"
            type="text"
            value={banchi || ""}
            onChange={setBanchi}
            placeholder="〇-〇〇"
            hissu
            />
            <InputStr
            title="建物名・部屋番号"
            type="text"
            value={building || ""}
            onChange={setBuilding}
            placeholder="〇〇マンション××号室"
            hissu={false}
            />

            <InputStr
            title="電話番号"
            type="tel"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="電話番号"
            hissu
            patternNum
            />

            <div className={styles.genderDiv}>
                <InputTitle title="性別" hissu />
                <div className={styles.genderRadioDiv}>
                    {genderOptions.map((option) => (
                        <label key={option.id} className={styles.genderRadio}>
                            <input
                            type="radio"
                            name="gender"
                            value={option.name}
                            checked={selectedGender === option.id}
                            onChange={() => setSelectedGender(option.id)}
                            className="cursor-pointer"
                            required
                            />
                            {option.name}
                        </label>
                    ))}
                </div>
            </div>

            {campaign && <p className={styles.campaignText}>※本人確認完了後に300pt配布キャンペーン実施中！</p>}

            <Button onClick={submit}>送信する</Button>
        </EditUI>
    );
};