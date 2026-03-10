import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ItemListUI from "../itemListUI";
import { ItemList } from "../itemList";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "カート",
        description: "カートに追加した商品をご覧いただけます。",
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Page() {
    const session = await getServerSession(authOptions);
        
    if (!session) redirect("/login");
    
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/related-item-list`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    return (
        <ItemListUI title="カート">
            <ItemList
            page="cart"
            />
        </ItemListUI>
    );
};