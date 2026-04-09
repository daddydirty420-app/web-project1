"use client";

import { useRouter } from "next/navigation";
import styles from "@/components/confirm-card/confirmcard.module.css";
import { ShopInfo } from "../type";
import SSUI from "../ssUI";
import { ButtonDiv } from "../buttonDiv";
import { ConfirmSection } from "@/components";
import { useState } from "react";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/getAccessToken";

type Props = {
    shopId: string;
    shopInfo: ShopInfo;
};

export const Client = ({ shopId, shopInfo }: Props) => {
    const [comOrFree, setComOrFree] = useState(shopInfo.ComOrFreeOption?.id ?? "");
    const [companyName, setCompanyName] = useState(shopInfo.company_name ?? "");
    const [shopName, setShopName] = useState(shopInfo.shop_name ?? "");
    const [phoneNumber, setPhoneNumber] = useState(shopInfo.phone_number ?? "");
    const [email, setEmail] = useState(shopInfo.email ?? "");
    const [openDateTime, setOpenDateTime] = useState(shopInfo.open_date_time ?? "");
    const [foundedDate, setFoundedDate] = useState(shopInfo.founded_date ?? "");
    const [memberCount, setMemberCount] = useState(shopInfo.member_count ?? "");
    const [homepage, setHomepage] = useState(shopInfo.homepage_url ?? "");

    const [companyNumber, setCompanyNumber] = useState(shopInfo.company_number ?? "");
    const [capital, setCapital] = useState(shopInfo.capital);

    const [autoTrans, setAutoTrans] = useState(shopInfo.auto_trans ? "true" : "false");
    const [openInfo, setOpenInfo] = useState(shopInfo.open_info ? "true" : "false");

    const router = useRouter();

    const updateField = async (field: string, value: string | number | Date) => {
        try {
            const accessToken = await getAccessToken();
                
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup-create/edit/${shopId}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ [field]: value }),
            });
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const submit = async () => {
        try {
            const accessToken = await getAccessToken();
        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup-create/5/${shopId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                console.log(data.message);
                toast.error("データ登録に失敗しました。");
                return;
            }

            router.replace("/shop-signup/complete");
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const backSubmit = () => router.push(`/shop-signup/step4/${shopId}`);

    const comNameTitle = comOrFree === 1
    ? "会社名" : "屋号";

    const foundDateTitle = comOrFree === 1
    ? "登記年月日" : "創業日";

    const displayFoundedDate = new Date(foundedDate).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <SSUI title="確認">
            <main className={styles.confirmWrapper}>

                <ConfirmSection
                title="事業形態"
                content={comOrFree === 1 ? "法人" : comOrFree === 2 ? "個人事業主" : ""}
                radio
                value={comOrFree}
                radioOptions={[
                    { label: "法人", value: 1 },
                    { label: "個人事業主", value: 2 },
                ]}
                onChange={(v) => setComOrFree(Number(v))}
                onSubmit={() => updateField("com_or_free_id", comOrFree)}
                />

                <ConfirmSection
                title={comNameTitle}
                content={companyName}
                input
                value={companyName}
                onChange={(v) => setCompanyName(v)}
                onSubmit={() => updateField("company_name", companyName)}
                />

                <ConfirmSection
                title="ショップ名"
                content={shopName}
                input
                value={shopName}
                onChange={(v) => setShopName(v)}
                onSubmit={() => updateField("shop_name", shopName)}
                />

                <ConfirmSection
                title="電話番号"
                content={phoneNumber}
                input
                value={phoneNumber}
                onChange={(v) => setPhoneNumber(v)}
                onSubmit={() => updateField("phone_number", phoneNumber)}
                />

                <ConfirmSection
                title="代表メールアドレス"
                content={email}
                input
                value={email}
                onChange={(v) => setEmail(v)}
                onSubmit={() => updateField("email", email)}
                />

                <ConfirmSection
                title="営業日・定休日"
                content={openDateTime}
                input
                value={openDateTime}
                onChange={(v) => setOpenDateTime(v)}
                onSubmit={() => updateField("open_date_time", openDateTime)}
                />

                <ConfirmSection
                title={foundDateTitle}
                content={displayFoundedDate}
                date
                value={foundedDate}
                onChange={(v) => setFoundedDate(v)}
                onSubmit={() => updateField("founded_date", foundedDate)}
                />

                <ConfirmSection
                title="従業員数"
                content={String(memberCount)}
                input
                value={memberCount}
                onChange={(v) => setMemberCount(v)}
                onSubmit={() => updateField("member_count", memberCount)}
                />

                <ConfirmSection
                title="ホームページURL"
                content={homepage}
                input
                value={homepage}
                onChange={(v) => setHomepage(v)}
                onSubmit={() => updateField("homepage_url", homepage)}
                />

                {comOrFree === 1 && (
                    <>
                    <ConfirmSection
                    title="法人番号"
                    content={companyNumber}
                    input
                    value={companyNumber}
                    onChange={(v) => setCompanyNumber(v)}
                    onSubmit={() => updateField("company_number", companyNumber)}
                    />

                    <ConfirmSection
                    title="資本金"
                    content={String(capital)}
                    input
                    value={capital}
                    onChange={(v) => setCapital(v)}
                    onSubmit={() => updateField("capital", capital)}
                    />
                    </>
                )}

                <ConfirmSection
                title="代表者氏名"
                content={`${shopInfo.RepresentativeName?.sei ?? ""} ${shopInfo.RepresentativeName?.mei ?? ""}`}
                link={`/edit/name/shop/rep-name/signup/${shopId}`}
                />

                <ConfirmSection
                title="代表者氏名（カナ）"
                content={`${shopInfo.RepresentativeName?.sei_kana ?? ""} ${shopInfo.RepresentativeName?.mei_kana ?? ""}`}
                link={`/edit/name/shop/rep-name/signup/${shopId}`}
                />

                <ConfirmSection
                title="担当者氏名"
                content={`${shopInfo.ContactName?.sei ?? ""} ${shopInfo.ContactName?.mei ?? ""}`}
                link={`/edit/name/shop/con-name/signup/${shopId}`}
                />

                <ConfirmSection
                title="担当者氏名（カナ）"
                content={`${shopInfo.ContactName?.sei_kana ?? ""} ${shopInfo.ContactName?.mei_kana ?? ""}`}
                link={`/edit/name/shop/con-name/signup/${shopId}`}
                />

                <ConfirmSection
                title="所在地"
                content={`〒${shopInfo.Address?.post_number ?? ""}
                ${shopInfo.Address?.AddressTodouhuken?.name ?? ""}
                ${shopInfo.Address?.shikutyouson ?? ""}
                ${shopInfo.Address?.banchi ?? ""}
                ${shopInfo.Address?.building ?? ""}`}
                link={`/edit/address/shop/signup/${shopId}`}
                />

                <ConfirmSection
                title="振込口座"
                content={`銀行名： ${shopInfo.BankAccount?.bank_name ?? ""}
                支店名： ${shopInfo.BankAccount?.branch_code ?? ""}
                口座種別： ${shopInfo.BankAccount?.AccountTypeOption?.name ?? ""}
                口座番号： ${shopInfo.BankAccount?.account_number ?? ""}
                口座名義： ${shopInfo.BankAccount?.meigi ?? ""}`}
                link={`/edit/account/shop/signup/${shopId}`}
                />

                <ConfirmSection
                title="自動振込"
                content={autoTrans === "true" ? "はい" : "いいえ"}
                radio
                value={autoTrans}
                radioOptions={[
                    { label: "はい", value: "true" },
                    { label: "いいえ", value: "false" },
                ]}
                onChange={(v) => setAutoTrans(v)}
                onSubmit={() => updateField("auto_trans", autoTrans)}
                />

                <ConfirmSection
                title="運営者情報を表示する"
                content={openInfo === "true" ? "はい" : "いいえ"}
                radio
                value={openInfo}
                radioOptions={[
                    { label: "はい", value: "true" },
                    { label: "いいえ", value: "false" },
                ]}
                onChange={(v) => setOpenInfo(v)}
                onSubmit={() => updateField("open_info", openInfo)}
                />
            </main>

            <ButtonDiv backClick={backSubmit} nextClick={submit} />
        </SSUI>
    );
};