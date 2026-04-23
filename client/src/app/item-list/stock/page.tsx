import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ItemList } from "../itemList";
import ItemListUI from "../itemListUI";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "在庫一覧",
        description: "出品した商品の在庫を確認できます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    return (
        <ItemListUI title="在庫一覧">
            <ItemList page="stock" />
        </ItemListUI>
    );
}
