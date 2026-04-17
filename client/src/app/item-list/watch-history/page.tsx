import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ItemListUI from "../itemListUI";
import { ItemList } from "../itemList";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "閲覧履歴",
        description: "閲覧した商品の一覧をご覧いただけます。",
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
        <ItemListUI title="閲覧した商品">
            <ItemList page="watch-history" />
        </ItemListUI>
    );
}
