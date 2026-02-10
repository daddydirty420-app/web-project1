import { Metadata } from "next";
import { Lp } from "./lp";
import { Items } from "@/types/itemListTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

type Res = {
    items: Items[];
    totalPages: number;
};

export const metadata: Metadata = {
    title: "FLEX OUTDOOR",
    description: "自慢のギアを動画で自慢！全く新しいアウトドア専門フリマ「FLEX OUTDOOR」。新品からヴィンテージ品まで、動画だから商品の魅力から使い方、状態まで一目瞭然！アウトドア好き同士がつながる、新しい売買体験を！",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function Page() {
    const session = await getServerSession(authOptions);
    const loggedIn = !!session?.user;
        
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    const defaultLimit = 15;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-list/index-item-list/video-list?page=1&limit=${defaultLimit}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
        },
        next: { revalidate: 300 },
    });

    const data: Res = await res.json();

    return <Lp itemList={data || null} loggedIn={loggedIn} />;
};