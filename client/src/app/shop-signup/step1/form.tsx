"use client";

import styles from "../ss.module.css";
import SSUIBack from "../ssUiBack";
import { ComOrFreeOption, ShopInfo, User } from "../type";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InputStr, InputTitle, InputStrAndSmall } from "@/components/inputForm";
import Link from "next/link";
import { ButtonDiv } from "../buttonDiv";
import DatePicker from "react-datepicker";
import { ja } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { StepBar } from "../stepBar";
import { refreshToken } from "@/lib/refreshToken";
import clsx from "clsx";
import toast from "react-hot-toast";

type Props = {
    user: User;
    shopInfo: ShopInfo | null;
    ComOrFreeOption: ComOrFreeOption[];
};

export const Form = ({ user, shopInfo, ComOrFreeOption }: Props) => {
    const [selectOption, setSelectOption] = useState<number | null>(null);
    const [companyName, setCompanyName] = useState(shopInfo?.company_name ?? "");
    const [shopName, setShopName] = useState(shopInfo?.shop_name ?? user.user_name);
    const [phoneNumber, setPhoneNumber] = useState(shopInfo?.phone_number ??user.phone_number);
    const [email, setEmail] = useState(shopInfo?.email ?? user.email ?? "");
    const [openDateTime, setOpenDateTime] = useState(shopInfo?.open_date_time ?? "");
    const [foundedDate, setFoundedDate] = useState<Date | null>(shopInfo?.founded_date ?? null);
    const [memberCount, setMemberCount] = useState(shopInfo?.member_count ?? 0);
    const [homepage, setHomepage] = useState<string | null>(shopInfo?.homepage_url ?? "");

    const [companyNumber, setCompanyNumber] = useState(shopInfo?.company_number ?? "");
    const [capital, setCapital] = useState<number | null>(shopInfo?.capital ?? null);

    const [repSei, setRepSei] = useState(shopInfo?.RepresentativeName?.sei ?? user.Name?.sei ?? "");
    const [repMei, setRepMei] = useState(shopInfo?.RepresentativeName?.mei ?? user.Name?.mei ?? "");
    const [repSeiKana, setRepSeiKana] = useState(shopInfo?.RepresentativeName?.sei_kana ?? user.Name?.sei_kana ?? "");
    const [repMeiKana, setRepMeiKana] = useState(shopInfo?.RepresentativeName?.mei_kana ?? user.Name?.mei_kana ?? "");

    const [conSei, setConSei] = useState(shopInfo?.ContactName?.sei ?? user.Name?.sei ?? "");
    const [conMei, setConMei] = useState(shopInfo?.ContactName?.mei ?? user.Name?.mei ?? "");
    const [conSeiKana, setConSeiKana] = useState(shopInfo?.ContactName?.sei_kana ?? user.Name?.sei_kana ?? "");
    const [conMeiKana, setConMeiKana] = useState(shopInfo?.ContactName?.mei_kana ?? user.Name?.mei_kana ?? "");
    
    const [postNumber, setPostNumber] = useState(shopInfo?.Address?.post_number ?? user.Address?.post_number ?? "");
    const [todouhuken, setTodouhuken] = useState(shopInfo?.Address?.AddressTodouhuken?.name ?? user.Address?.AddressTodouhuken?.name ?? "");
    const [shikutyouson, setShikutyouson] = useState(shopInfo?.Address?.shikutyouson ?? user.Address?.shikutyouson ?? "");
    const [banchi, setBanchi] = useState(shopInfo?.Address?.banchi ?? user.Address?.banchi ?? "");
    const [building, setBuilding] = useState(shopInfo?.Address?.building ?? user.Address?.building ?? "");

    const [check, setCheck] = useState(false);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (isInitialLoad) {
            setIsInitialLoad(false);
            return;
        }

        if (postNumber && postNumber.length === 7) {
            handleZipSearch();
        }
    }, [postNumber, isInitialLoad]);

    const handleZipSearch = async () => {
        if (!postNumber || postNumber.length < 7) {
            toast.error("7桁の郵便番号を入力してください。");
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
            };

            setTodouhuken(data.address.todouhuken_name);
            setShikutyouson(data.address.shikutyouson);
        } catch (err) {
            console.error(err);
        }
    };

    const submit = async () => {
        if (!check) {
            toast.error("利用規約およびプライバシーポリシーに同意の上、チェックボタンを押してください。");
            return;
        }

        const normalizedPostNumber = postNumber?.replace(/-/g, "");
        if (!/^[0-9]{7}$/.test(normalizedPostNumber || "")) {
            toast.error("郵便番号は半角数字7桁で入力してください。");
            return;
        }

        if (memberCount > 100000000 || memberCount === 0) {
            toast.error("従業員数が不正な値です。");
            return;
        }

        if ((!/^\d+$/.test(companyNumber) || companyNumber.length !== 13) && selectOption === 1) {
            toast.error("法人番号が正しくありません。");
            return;
        }

        const body = {
            selectOption,
            companyName,
            shopName,
            phoneNumber,
            email,
            openDateTime,
            foundedDate,
            memberCount,
            homepage,
            repSei,
            repMei,
            repSeiKana,
            repMeiKana,
            conSei,
            conMei,
            conSeiKana,
            conMeiKana,
            postNumber,
            todouhuken,
            shikutyouson,
            banchi,
            building,
            ...(selectOption === 1 && {
                companyNumber,
                capital,
            }),
        };

        const requiredBody = [
            selectOption,
            companyName,
            shopName,
            phoneNumber,
            email,
            openDateTime,
            foundedDate,
            memberCount,
            repSei,
            repMei,
            repSeiKana,
            repMeiKana,
            conSei,
            conMei,
            conSeiKana,
            conMeiKana,
            postNumber,
            todouhuken,
            shikutyouson,
            banchi,
            ...(selectOption === 1 ? [companyNumber, capital] : []),
        ];

        if (requiredBody.some(v => v === "" || v === undefined || v === null)) {
            toast.error("未入力の項目があります。");
            return;
        }

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup-create/1`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error("データ登録に失敗しました。");
                console.error(data.message);
                return;
            }

            router.push(`/shop-signup/step2/${data.id}`);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const backSubmit = () => router.back();

    return (
        <SSUIBack title="ショップ登録">
            <StepBar />
            
            <h2 className={styles.subtitle}>事業者情報</h2>

            <div className={styles.radioFlex}>
                <p className={styles.text14}>事業形態を選択：</p>
                <div className={styles.radioColumn}>
                    {ComOrFreeOption.map((option) => (
                        <label key={option.id} className={styles.radioLabel}>
                            <input
                            type="radio"
                            name="comorfree"
                            value={option.name}
                            checked={selectOption === option.id}
                            onChange={() => setSelectOption(option.id)}
                            className={styles.radio}
                            required
                            />
                            <p className={styles.radioText}>{option.name}</p>
                        </label>
                    ))}
                </div>
            </div>

            <InputStrAndSmall
            title="会社名/屋号"
            type="text"
            value={companyName}
            onChange={setCompanyName}
            placeholder="株式会社〇〇"
            hissu
            small="※個人事業主の方で屋号が無い場合、本名フルネームをご入力ください。"
            />

            <InputStrAndSmall
            title="ショップ名"
            type="text"
            value={shopName}
            onChange={setShopName}
            placeholder="〇〇〇〇"
            hissu
            small="※プロフィールに表示する店舗名を入力します。"
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

            <InputStr
            title="代表メールアドレス"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="*****@****.***"
            hissu
            />

            <InputStr
            title="営業日（定休日）、営業時間"
            type="text"
            value={openDateTime}
            onChange={setOpenDateTime}
            placeholder="平日9時～17時（土日祝は定休日）"
            hissu
            />

            <div className={styles.inputDiv}>
                <InputTitle title={`${selectOption === 1 ? "登記年月日" : "創業日"}`} hissu />

                <DatePicker
                selected={foundedDate}
                onChange={(date) => setFoundedDate(date)}
                dateFormat="yyyy年MM月dd日"
                locale={ja}
                placeholderText="創業日を選択"
                className={styles.input}
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                required
                />
            </div>

            <div className={styles.inputDiv}>
                <InputTitle title="従業員数" hissu />

                <input
                type="number"
                value={memberCount || ""}
                onChange={(e) => setMemberCount(Number(e.target.value))}
                className={styles.input}
                placeholder="50"
                required
                />
            </div>

            <InputStr
            title="ホームページURL（任意）"
            type="text"
            value={homepage || ""}
            onChange={setHomepage}
            placeholder="http://*******.***"
            hissu={false}
            />

            {selectOption === 1 && (
                <>
                <InputStr
                title="法人番号"
                type="text"
                value={companyNumber}
                onChange={setCompanyNumber}
                placeholder="1122334455667"
                hissu
                />

                <div className={styles.inputDiv}>
                    <InputTitle title="資本金" hissu />

                    <div className={styles.inputFlex}>
                        <p className={styles.text14}>￥</p>
                        <input
                        type="number"
                        value={capital || ""}
                        onChange={(e) => setCapital(Number(e.target.value))}
                        placeholder="3,000,000"
                        className={styles.input}
                        required
                        />
                    </div>
                </div>
                </>
            )}

            <h2 className={styles.subtitle}>代表者氏名</h2>

            <div className={styles.nameFlex}>
                <InputStr
                title="姓"
                type="text"
                value={repSei || ""}
                onChange={setRepSei}
                placeholder="炭火"
                hissu
                />
                <InputStr
                title="名"
                type="text"
                value={repMei || ""}
                onChange={setRepMei}
                placeholder="焼太郎"
                hissu
                />
            </div>

            <div className={styles.nameFlex}>
                <InputStr
                title="セイ"
                type="text"
                value={repSeiKana || ""}
                onChange={setRepSeiKana}
                placeholder="スミビ"
                hissu
                />
                <InputStr
                title="メイ"
                type="text"
                value={repMeiKana || ""}
                onChange={setRepMeiKana}
                placeholder="ヤキタロウ"
                hissu
                />
            </div>

            <h2 className={styles.subtitle}>担当者氏名</h2>

            <div className={styles.nameFlex}>
                <InputStr
                title="姓"
                type="text"
                value={conSei || ""}
                onChange={setConSei}
                placeholder="炭火"
                hissu
                />
                <InputStr
                title="名"
                type="text"
                value={conMei || ""}
                onChange={setConMei}
                placeholder="焼太郎"
                hissu
                />
            </div>

            <div className={styles.nameFlex}>
                <InputStr
                title="セイ"
                type="text"
                value={conSeiKana || ""}
                onChange={setConSeiKana}
                placeholder="スミビ"
                hissu
                />
                <InputStr
                title="メイ"
                type="text"
                value={conMeiKana || ""}
                onChange={setConMeiKana}
                placeholder="ヤキタロウ"
                hissu
                />
            </div>

            <p className={clsx("mt-1", styles.centerSmall)}>※代表者・担当者氏名は同一人物でも異なる人物でも構いません。</p>

            <h2 className={styles.subtitle}>住所</h2>

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

            <h2 className={styles.subtitle}>利用規約・プライバシーポリシー</h2>

            <p className={styles.linkText}>事前に
                <Link href="/terms-and-conditions" className={styles.link}>利用規約</Link>
                および
                <Link href="/privacy-policy" className={styles.link}>プライバシーポリシー</Link>
                をご確認ください。
            </p>

            <label className={styles.checkLabel}>
                <input
                type="checkbox"
                name="checkbox"
                checked={check}
                onChange={() => setCheck(!check)}
                className={styles.check}
                />
                <p className={styles.checkText}>利用規約およびプライバシーポリシーに同意します。</p>
            </label>

            <ButtonDiv nextClick={submit} backClick={backSubmit} />
        </SSUIBack>
    );
};