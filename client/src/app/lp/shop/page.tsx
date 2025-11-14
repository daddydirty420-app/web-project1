import { Metadata } from "next";
import Lp from "../lp";
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
    description: "自慢のギアを動画で自慢！全く新しいアウトドア専門フリマ「FLEX OUTDOOR」。「FLEX OUTDOOR」にショップを開店して、圧倒的な面白さと信頼性でギアの販売を加速させませんか？",
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

    const shopRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-info/has-shop/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session?.accessToken ?? ""}`,
        },
        cache: 'no-store',
    });

    let hasShop = false;
    if (shopRes.ok) {
        const data = await shopRes.json();
        hasShop = data.hasShop;
    }

    return <Lp shopPage hasShop={hasShop} itemList={data} session={session} />;
};