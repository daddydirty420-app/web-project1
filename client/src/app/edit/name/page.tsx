import { Metadata } from "next";
import { fetchNamePage } from "../api/name/server";
import { NameEditForm } from "./nameEditForm";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "氏名の設定・変更",
        description: "氏名を設定・変更できます。（ユーザーネーム等プロフィールの変更ではございません。）",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const data = await fetchNamePage();

    return <NameEditForm name={data.name} page="normal" />;
}
