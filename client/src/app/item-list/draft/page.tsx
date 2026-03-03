import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import ItemListUI from "../itemListUI";
import { ItemList } from "../itemList";

type Props = {
    params: { id: string };
};

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

export default async function Page({ params }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;
        
    if (!accessToken) redirect("/login");

    return (
        <ItemListUI title="下書き商品">
            <ItemList
            page="draft"
            />
        </ItemListUI>
    );
};