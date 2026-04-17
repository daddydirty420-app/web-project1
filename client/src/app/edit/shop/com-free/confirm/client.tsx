'use client';

import styles from '@/components/confirm-card/confirmcard.module.css';
import EditUI from '@/app/edit/editUI';
import { ShopInfo, ShopInfoEdit } from '@/app/edit/type';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmSection } from '@/components';
import { Button } from '@/components/inputForm';
import { getAccessToken } from '@/lib/getAccessToken';

type Props = {
    shopId: string;
    shopInfo: ShopInfo;
    shopEditId: string;
    shopInfoEdit: ShopInfoEdit;
};

export const Client = ({ shopId, shopInfo, shopEditId, shopInfoEdit }: Props) => {
    const [companyName, setCompanyName] = useState(shopInfoEdit.company_name ?? shopInfo.company_name ?? '');
    const [phoneNumber, setPhoneNumber] = useState(shopInfoEdit.phone_number ?? shopInfo.phone_number ?? '');
    const [email, setEmail] = useState(shopInfoEdit.email ?? shopInfo.email ?? '');
    const [openDateTime, setOpenDateTime] = useState(shopInfoEdit.open_date_time ?? shopInfo.open_date_time ?? '');
    const [foundedDate, setFoundedDate] = useState(shopInfoEdit.founded_date ?? shopInfo.founded_date ?? '');
    const [memberCount, setMemberCount] = useState(shopInfoEdit.member_count ?? shopInfo.member_count ?? '');
    const [homepage, setHomepage] = useState(shopInfoEdit.homepage_url ?? shopInfo.homepage_url ?? '');

    const [companyNumber, setCompanyNumber] = useState(shopInfoEdit.company_number ?? shopInfo.company_number ?? '');
    const [capital, setCapital] = useState(shopInfoEdit.capital ?? shopInfo.capital ?? '');

    const router = useRouter();

    const updateField = async (field: string, value: string | number | Date) => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert('認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。');
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-com-free/edit/${shopEditId}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ [field]: value }),
            });
        } catch (err) {
            alert('システムエラーが発生しました。時間をおいて再試行してください。');
            console.error(err);
        }
    };

    const submit = async () => router.push(`/edit/shop/com-free/upload/${shopEditId}`);

    const comOrFree = shopInfoEdit.ComOrFreeOption?.id;

    const comNameTitle = comOrFree === 1 ? '会社名' : '屋号';

    const foundDateTitle = comOrFree === 1 ? '登記年月日' : '創業日';

    const displayFoundedDate = new Date(foundedDate).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const name = shopInfoEdit.Name ?? shopInfo.RepresentativeName;
    const address = shopInfoEdit.Address ?? shopInfo.Address;
    const bankAccount = shopInfoEdit.BankAccount ?? shopInfo.BankAccount;

    return (
        <EditUI title="事業者情報の確認・変更">
            <main className={styles.confirmWrapper}>
                <ConfirmSection
                    title="事業形態"
                    content={comOrFree === 1 ? '法人' : comOrFree === 2 ? '個人事業主' : ''}
                    link={`/edit/shop/com-free/${shopId}`}
                />

                <ConfirmSection
                    title={comNameTitle}
                    content={companyName}
                    input
                    value={companyName}
                    onChange={(v) => setCompanyName(v)}
                    onSubmit={() => updateField('company_name', companyName)}
                />

                <ConfirmSection
                    title="電話番号"
                    content={phoneNumber}
                    input
                    value={phoneNumber}
                    onChange={(v) => setPhoneNumber(v)}
                    onSubmit={() => updateField('phone_number', phoneNumber)}
                />

                <ConfirmSection
                    title="代表メールアドレス"
                    content={email}
                    input
                    value={email}
                    onChange={(v) => setEmail(v)}
                    onSubmit={() => updateField('email', email)}
                />

                <ConfirmSection
                    title="営業日・定休日"
                    content={openDateTime}
                    input
                    value={openDateTime}
                    onChange={(v) => setOpenDateTime(v)}
                    onSubmit={() => updateField('open_date_time', openDateTime)}
                />

                <ConfirmSection
                    title={foundDateTitle}
                    content={displayFoundedDate}
                    date
                    value={foundedDate}
                    onChange={(v) => setFoundedDate(v)}
                    onSubmit={() => updateField('founded_date', foundedDate)}
                />

                <ConfirmSection
                    title="従業員数"
                    content={String(memberCount)}
                    input
                    value={memberCount}
                    onChange={(v) => setMemberCount(v)}
                    onSubmit={() => updateField('member_count', memberCount)}
                />

                <ConfirmSection
                    title="ホームページURL"
                    content={homepage}
                    input
                    value={homepage}
                    onChange={(v) => setHomepage(v)}
                    onSubmit={() => updateField('homepage_url', homepage)}
                />

                {comOrFree === 1 && (
                    <>
                        <ConfirmSection
                            title="法人番号"
                            content={companyNumber}
                            input
                            value={companyNumber}
                            onChange={(v) => setCompanyNumber(v)}
                            onSubmit={() => updateField('company_number', companyNumber)}
                        />

                        <ConfirmSection
                            title="資本金"
                            content={String(capital)}
                            input
                            value={capital}
                            onChange={(v) => setCapital(v)}
                            onSubmit={() => updateField('capital', capital)}
                        />
                    </>
                )}

                <ConfirmSection
                    title="代表者氏名"
                    content={`${name?.sei ?? ''} ${name?.mei ?? ''}`}
                    link={`/edit/name/shop/rep-name/com-free/${shopEditId}`}
                />

                <ConfirmSection
                    title="代表者氏名（カナ）"
                    content={`${name?.sei_kana ?? ''} ${name?.mei_kana ?? ''}`}
                    link={`/edit/name/shop/rep-name/com-free/${shopEditId}`}
                />

                <ConfirmSection
                    title="担当者氏名"
                    content={`${shopInfo.ContactName?.sei ?? ''} ${shopInfo.ContactName?.mei ?? ''}`}
                    link={`/edit/name/shop/con-name/com-free/${shopEditId}`}
                />

                <ConfirmSection
                    title="担当者氏名（カナ）"
                    content={`${shopInfo.ContactName?.sei_kana ?? ''} ${shopInfo.ContactName?.mei_kana ?? ''}`}
                    link={`/edit/name/shop/con-name/com-free/${shopEditId}`}
                />

                <ConfirmSection
                    title="所在地"
                    content={`〒${address?.post_number ?? ''}
                ${address?.AddressTodouhuken?.name ?? ''}
                ${address?.shikutyouson ?? ''}
                ${address?.banchi ?? ''}
                ${address?.building ?? ''}`}
                    link={`/edit/address/shop/com-free/${shopEditId}`}
                />

                <ConfirmSection
                    title="振込口座"
                    content={`銀行名： ${bankAccount?.bank_name ?? ''}
                支店名： ${bankAccount?.branch_code ?? ''}
                口座種別： ${bankAccount?.AccountTypeOption?.name ?? ''}
                口座番号： ${bankAccount?.account_number ?? ''}
                口座名義： ${bankAccount?.meigi ?? ''}`}
                    link={`/edit/account/shop/com-free/${shopEditId}`}
                />

                <Button onClick={submit}>次へ</Button>
            </main>
        </EditUI>
    );
};
