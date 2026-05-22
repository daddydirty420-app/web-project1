import { Metadata } from "next";
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
        title: "売却した商品",
        description: "売却した商品の配送状況や取引の進捗などの一覧を確認できます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ searchParams }: Props) {
    const tab = (await searchParams)?.tab ?? "all";

    return (
        <>
            <TabHeader page="sold" tab={tab} />

            <OrderListUI>
                <OrderList page="sold" tab={tab} />
            </OrderListUI>
        </>
    );
}
