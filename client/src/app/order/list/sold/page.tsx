import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TabHeader } from "../tabHeader";
import OrderListUI from "../orderListUI";
import { OrderList } from "../orderList";

type Props = {
    searchParams: {
        tab?: "all" | "wait" | "shipping" | "complete";
    };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "売却した商品",
        description: "売却した商品の配送状況や取引の進捗などの一覧を確認できます。",
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Page({ searchParams }: Props) {
    const session = await getServerSession(authOptions);
        
    if (!session) redirect("/login");

    const tab = (await searchParams)?.tab ?? "all";

    return (
        <>
        <TabHeader
        page="sold"
        tab={tab}
        />

        <OrderListUI>
            <OrderList
            page="sold"
            tab={tab}
            />
        </OrderListUI>
        </>
    );
}