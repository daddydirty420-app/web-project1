import { Metadata } from "next";
import { fetchOptionPage } from "../../../api/shop/shopInfo/server";
import { Form } from "../form";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "オプションの設定・変更",
        description: "ショップのオプションを設定・変更できます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const data = await fetchOptionPage(id);

    return <Form shopId={id} shopInfo={data.shop} />;
}
