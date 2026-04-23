import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ItemList } from "../itemList";
import ItemListUI from "../itemListUI";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "下書き商品一覧",
        description: "下書き保存した商品をご覧いただけます。",
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
        <ItemListUI title="下書き商品">
            <ItemList page="draft" />
        </ItemListUI>
    );
}
