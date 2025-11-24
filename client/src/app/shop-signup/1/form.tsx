"use client";

import styles from "../ss.module.css";
import SSUIBack from "../ssUiBack";
import { ComOrFreeOption, ShopInfo, User } from "../type";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InputStr, InputTitle, InputStrAndSmall } from "@/components/inputForm";
import Link from "next/link";
import ButtonDiv from "../buttonDiv";
import DatePicker from "react-datepicker";
import { ja } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import StepBar from "../stepBar";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    user: User;
    shopInfo: ShopInfo | null;
    ComOrFreeOption: ComOrFreeOption[];
};

export default function Form({ user, shopInfo, ComOrFreeOption }: Props) {
    const [selectOption, setSelectOption] = useState<number | null>(null);
    const [companyName, setCompanyName] = useState(shopInfo?.conpany_name || "");
    const [shopName, setShopName] = useState(user.user_name);
    const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
    const [email, setEmail] = useState(`${shopInfo ? shopInfo.email : user.email}`);
    const [openDateTime, setOpenDateTime] = useState(shopInfo?.open_date_time || "");
    const [foundedDate, setFoundedDate] = useState(shopInfo?.founded_date || null);
    const [memberCount, setMemberCount] = useState(shopInfo?.member_count || 1);
    const [homepage, setHomepage] = useState(shopInfo?.homepage_url || null);

    const [companyNumber, setCompanyNumber] = useState(shopInfo?.company_number || "");
    const [capital, setCapital] = useState(shopInfo?.capital || null);

    const [sei, setSei] = useState(user.Name?.sei);
    const [mei, setMei] = useState(user.Name?.mei);
    const [seiKana, setSeiKana] = useState(user.Name?.sei_kana);
    const [meiKana, setMeiKana] = useState(user.Name?.mei_kana);
    
    const [postNumber, setPostNumber] = useState(user.Address?.post_number);
    const [todouhuken, setTodouhuken] = useState(user.Address?.AddressTodouhuken?.name);
    const [shikutyouson, setShikutyouson] = useState(user.Address?.shikutyouson);
    const [banchi, setBanchi] = useState(user.Address?.banchi);
    const [building, setBuilding] = useState(user.Address?.building);

    const [check, setCheck] = useState(false);

    const router = useRouter();

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

    const submit = async () => {
        if (!check) {
            alert("利用規約およびプライバシーポリシーに同意の上、チェックボタンを押してください。");
            return;
        }

        const normalizedPostNumber = postNumber?.replace(/-/g, "");
        if (!/^[0-9]{7}$/.test(normalizedPostNumber || "")) {
            alert("郵便番号は半角数字7桁で入力してください。");
            return;
        }

        if ((!/^\d+$/.test(companyNumber) || companyNumber.length !== 13) && selectOption === 1) {
            alert("法人番号が正しくありません。");
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
            sei,
            mei,
            seiKana,
            meiKana,
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
            sei,
            mei,
            seiKana,
            meiKana,
            postNumber,
            todouhuken,
            shikutyouson,
            banchi,
            ...(selectOption === 1 ? [companyNumber, capital] : []),
        ];

        if (requiredBody.some(v => v === "" || v === undefined || v === null)) {
            alert("未入力の項目があります。");
            return;
        }

        if (memberCount > 100000000) {
            alert("従業員数が不正な値です。");
            return;
        }

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup/signup1-create`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                console.error(data.message);
                return;
            }

            router.push(`/shop-signup/2/${data.id}`);
        } catch (err) {
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
                        <label key={option.id} className={styles.radio}>
                            <input
                            type="radio"
                            name="comorfree"
                            value={option.name}
                            checked={selectOption === option.id}
                            onChange={() => setSelectOption(option.id)}
                            className="cursor-pointer"
                            required
                            />
                            {option.name}
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

            <label className={styles.checkbox}>
                <input
                type="checkbox"
                name="checkbox"
                checked={check}
                onChange={() => setCheck(!check)}
                className="cursor-pointer"
                />
                利用規約およびプライバシーポリシーに同意します。
            </label>

            <ButtonDiv nextClick={submit} backClick={backSubmit} />
        </SSUIBack>
    );
};