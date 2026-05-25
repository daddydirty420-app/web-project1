import { Metadata } from "next";
import { fetchShopPhoneNumberPage } from "../../../api/phoneNumber/server";
import { PhoneNumberEdit } from "../../phoneNumberEdit";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "電話番号の設定・変更",
        description: "電話番号を設定・変更できます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const data = await fetchShopPhoneNumberPage(id);

    return <PhoneNumberEdit defaultPhoneNumber={data.shop.phone_number} page="shop" shopId={id} />;
}
