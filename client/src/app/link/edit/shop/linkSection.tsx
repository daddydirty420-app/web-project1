import { NormalLink, NormalLinkContainer } from "../../../../components/link";

type Props = {
    shopId: number;
};

export const linkSection = ({ shopId }: Props) => {
    return (
        <NormalLinkContainer>
            <NormalLink url={`/edit/name/shop/rep-name/${shopId}`} text="代表者氏名" />
            <NormalLink url={`/edit/name/shop/con-name/${shopId}`} text="ショップ担当者氏名" />
            <NormalLink url={`/edit/shop/company-name/${shopId}`} text="会社名/屋号" />
            <NormalLink url={`/edit/shop/com-free/${shopId}`} text="事業形態" />
            <NormalLink url={`/edit/address/shop/${shopId}`} text="住所" />
            <NormalLink url={`/edit/phone-number/shop/${shopId}`} text="電話番号" />
            <NormalLink url="/edit/email" text="メールアドレス" />
            <NormalLink url="/edit/password" text="パスワード" />
            <NormalLink url={`/edit/account/shop/${shopId}`} text="振込口座" />
            <NormalLink url={`/edit/shop/option/${shopId}`} text="オプション変更" />
            <NormalLink url={`/edit/shop/other/${shopId}`} text="その他ショップ情報" />
            <NormalLink url="/edit/profile" text="プロフィール変更" />
        </NormalLinkContainer>
    );
};
