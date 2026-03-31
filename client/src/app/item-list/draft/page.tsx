import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ItemListUI from "../itemListUI";
import { ItemList } from "../itemList";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "下書き商品一覧",
        description: "下書き保存した商品をご覧いただけます。",
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
        <ItemListUI title="下書き商品">
            <ItemList
            page="draft"
            />
        </ItemListUI>
    );
};