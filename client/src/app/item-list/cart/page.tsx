import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    const res = await fetch(`${process.env.API_URL}/items/recommend?view=cart`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    return (
        <ItemListUI title="カート">
            <ItemList page="cart" relatedItemList={data.items} />
        </ItemListUI>
    );
}
