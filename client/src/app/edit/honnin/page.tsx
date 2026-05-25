import { Metadata } from "next";
import { fetchHonninPage } from "../api/honnin/server";
import { HonninEditForm } from "./honninEditForm";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "本人確認入力フォーム",
        description:
            "本人確認のための個人情報等を入力するページです。※ただいま、本人確認完了後に300pt配布するキャンペーンを実施しております！",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const data = await fetchHonninPage();

    return <HonninEditForm user={data.user} genderOptions={data.genderAllOptions} campaign />;
}
