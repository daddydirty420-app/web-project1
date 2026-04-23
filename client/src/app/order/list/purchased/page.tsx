import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { OrderList } from "../orderList";
import OrderListUI from "../orderListUI";
import { TabHeader } from "../tabHeader";

type Props = {
    searchParams: {
        tab?: "all" | "wait" | "shipping" | "complete";
    };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "購入した商品",
        description: "購入した商品の配送状況や取引の進捗などの一覧を確認できます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ searchParams }: Props) {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    const tab = (await searchParams)?.tab ?? "all";

    return (
        <>
            <TabHeader page="purchased" tab={tab} />

            <OrderListUI>
                <OrderList page="purchased" tab={tab} />
            </OrderListUI>
        </>
    );
}
