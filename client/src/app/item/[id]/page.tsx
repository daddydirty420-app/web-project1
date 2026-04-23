import { authOptions } from "@/lib/auth";
import { Items } from "@/types/itemListTypes";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ItemPage } from "../itemPage";
import { Item, User } from "../itemPageTypes";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const res = await fetch(`${process.env.API_URL}/items/${id}/metadata`, {
        method: "GET",
        cache: "no-store",
    });

    const data = await res.json();
    const item = data.item;

    return {
        title: `${item.name}`,
        description: `${item.name}: ${item.price}, ${item.Video?.title}: ${item.Video?.summary}`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    const res = await fetch(`${process.env.API_URL}/items/${id}?mode=normal`, {
        method: "GET",
        cache: "no-store",
        headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
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

    const recommendRes = await fetch(`${process.env.API_URL}/items/recommend?view=itemPage&itemId=${id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
    });

    const recommendData = await recommendRes.json();

    const itemList: Items[] = recommendData.items ?? [];

    const loggedIn = !!session?.user;
    const userId = session?.user.id;

    const accessRes = await fetch(`${process.env.API_URL}/items/${id}/logs/access`, {
        method: "PATCH",
        headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
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
}
