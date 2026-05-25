import { Metadata } from "next";
import { fetchPhoneNumberPage } from "../api/phoneNumber/server";
import { PhoneNumberEdit } from "./phoneNumberEdit";

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

export default async function Page() {
    const data = await fetchPhoneNumberPage();

    return <PhoneNumberEdit defaultPhoneNumber={data.user.phone_number} page="normal" />;
}
