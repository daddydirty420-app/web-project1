import { Metadata } from "next";
import { fetchRecommend } from "../api/server";
import { ItemList } from "../itemList";
import ItemListUI from "../itemListUI";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "カート",
        description: "カートに追加した商品をご覧いただけます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const data = await fetchRecommend();

    return (
        <ItemListUI title="カート">
            <ItemList page="cart" relatedItemList={data.items} />
        </ItemListUI>
    );
}
