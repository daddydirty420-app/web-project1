import { Metadata } from "next";
import { fetchComFreePage } from "../../../api/shop/shopInfo/server";
import { Form } from "../form";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "事業形態の変更",
        description: "事業形態を変更できます。（事業形態の変更には審査が必要になります）",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const data = await fetchComFreePage(id);

    return <Form shopId={id} shopInfo={data.shop} ComOrFreeOption={data.comFree} />;
}
