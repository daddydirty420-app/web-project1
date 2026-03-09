import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ItemListUI from "../itemListUI";
import { ItemList } from "../itemList";
import { TabHeader } from "../tabHeader";
import ItemListHeaderUI from "../itemListHeaderUI";

type Props = {
    searchParams: {
        tab?: "all" | "selling";
    };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "出品した商品",
        description: "出品した商品を確認できます。",
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Page({ searchParams }) {
    const session = await getServerSession(authOptions);
        
    if (!session) redirect("/login");

    const tab = (await searchParams)?.tab ?? "all";

    return (
        <>
        <TabHeader
        page="uploaded"
        tab={tab}
        />

        <ItemListHeaderUI>
            <ItemList
            page="uploaded"
            uploadedTab={tab}
            />
        </ItemListHeaderUI>
        </>
    );
}