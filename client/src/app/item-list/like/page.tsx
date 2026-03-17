import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ItemListUI from "../itemListUI";
import { ItemList } from "../itemList";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "いいね商品一覧",
        description: "いいねした商品の一覧をご覧いただけます。",
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Page() {
    const session = await getServerSession(authOptions);
        
    if (!session) redirect("/login");

    return (
        <ItemListUI title="いいねした商品">
            <ItemList
            page="like"
            />
        </ItemListUI>
    );
};