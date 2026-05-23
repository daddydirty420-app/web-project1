import { Metadata } from "next";
import { fetchAccountPage } from "../../api/account/server";
import { AccountEditForm } from "../accountEditForm";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "口座情報の設定・変更",
        description: "口座情報を設定・変更できます。（当ページだけではなく、振込申請時にも振込口座の変更が可能です。）",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const data = await fetchAccountPage();

    return <AccountEditForm account={data.data} page="transfer" />;
}
