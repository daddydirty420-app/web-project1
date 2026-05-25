import { Metadata } from "next";
import { fetchShopEditConNamePage } from "../../../../../api/name/server";
import { NameEditForm } from "../../../../nameEditForm";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "担当者氏名の設定・変更",
        description: "担当者氏名の変更ができます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const data = await fetchShopEditConNamePage(id);

    return <NameEditForm name={data.name} page="con-com-free" shopEditId={id} />;
}
