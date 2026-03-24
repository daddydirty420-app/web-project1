import { Metadata } from "next";
import { ItemPage } from "../../itemPage";
import { Item } from "../../itemPageTypes";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/metadata/${id}`,{
        method: 'GET',
        cache: 'no-store'
    });

    const data = await res.json();
    const item = data.item;

    return {
        title: `${item.name} | 管理画面`,
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
    
    if (!accessToken || !session) redirect(`/item/${id}`);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page-admin/${id}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        notFound();
    }

    const data = await res.json();
    const item: Item = data.item;
    const commentCount: number = data.commentCount;
    const likeCount: number = data.goodCount;
    const reportCount: number = data.reportCount;

    const userId = session?.user.id;

    return <ItemPage
    id={id}
    item={item}
    page="admin"
    commentCount={commentCount}
    likeCount={likeCount}
    reportCount={reportCount}
    userId={userId || ""}
    loggedIn
    />;
};