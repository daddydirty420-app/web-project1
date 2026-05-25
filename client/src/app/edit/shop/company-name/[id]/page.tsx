import { Metadata } from "next";
import { fetchCompanyNamePage } from "../../../api/shop/shopInfo/server";
import { Form } from "../form";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "会社名・屋号の設定・変更",
        description: "会社名・屋号を設定・変更できます。（法人の場合、会社名の変更には審査が必要になります。）",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const data = await fetchCompanyNamePage(id);

    return <Form shopId={id} shopInfo={data.shop} />;
}
