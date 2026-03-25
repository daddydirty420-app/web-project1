import { Metadata } from "next";
import { ItemPage } from "../itemPage";
import { Item, User } from "../itemPageTypes";
import { Items } from "@/types/itemListTypes";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}/metadata`,{
        method: 'GET',
        cache: 'no-store'
    });

    const data = await res.json();
    const item = data.item;

    return {
        title: `${item.name}`,
        description: `${item.name}: ${item.price}, ${item.Video?.title}: ${item.Video?.summary}`,
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
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}?mode=normal`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
        },
    });

    if (!res.ok) {
        notFound();
    }

    const data = await res.json();

    const item: Item = data.item;
    const sellerMe: boolean = data.sellerMe;
    const commentCount: number = data.commentCount;
    const likeCount: number = data.likeCount;
    const isLike: boolean = data.isLikeByMe;
    const me: User = data.me;

    const recommendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/recommend?view=itemPage&itemId=${id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
        },
    });

    const recommendData = await recommendRes.json();

    const itemList: Items[] = recommendData.items ?? [];

    const loggedIn = !!session?.user;
    const userId = session?.user.id;

    const accessRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/access-normal/${id}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
        },
    });

    if (!accessRes) {
        console.warn("商品データ更新処理に失敗しました。");
    }

    return (
        <ItemPage
        id={id}
        item={item}
        itemList={itemList}
        sellerMe={sellerMe}
        page="normal"
        commentCount={commentCount}
        likeCount={likeCount}
        isLike={isLike}
        userId={userId || ""}
        loggedIn={loggedIn}
        me={me}
        />
    );
};