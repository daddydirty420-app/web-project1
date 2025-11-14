import { Metadata } from "next";
import Lp from "./lp";
import { Items } from "@/types/itemListTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchRefreshToken } from "@/lib/refreshToken";

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
    if (!session?.accessToken) {
        try {
            const newAccessToken = await fetchRefreshToken();
            if (session) {
                session.accessToken = newAccessToken;
            }
        } catch (err) {
            console.log(err);
        }
    }

    const defaultLimit = 15;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-list/index-item-list/video-list?page=1&limit=${defaultLimit}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session?.accessToken ?? ""}`,
        },
        next: { revalidate: 300 },
    });

    const data: Res = await res.json();

    return <Lp itemList={data} session={session} />;
};