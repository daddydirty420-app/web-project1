import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchItemHighlight } from "../../api/server";
import { OkPage } from "../okPage";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "商品を出品しました",
        description: "出品後の商品を確認できます。また、商品のレコメンドブースト機能を300円で購入できます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    const data = await fetchItemHighlight(id);

    const item = data.item;

    const userId = String(session?.user.id).trim();
    const sellerId = String(item.seller_id).trim();

    if (userId !== sellerId) {
        redirect("/upload/before");
    }

    if (item.status !== "active") {
        redirect(`/item/${id}`);
    }

    return <OkPage itemId={id} item={item} />;
}
