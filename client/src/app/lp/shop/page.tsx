import { Metadata } from "next";
import { Lp } from "../lp";
import { Items } from "@/types/itemListTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

type Res = {
    items: Items[];
    totalPages: number;
};

export const metadata: Metadata = {
    title: "○○",
    description:
        "自慢のギアを動画で自慢！全く新しいアウトドア専門フリマ「○○」。「○○」にショップを開店して、圧倒的な面白さと信頼性でギアの販売を加速させませんか？",
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

    const res = await fetch(
        `${process.env.API_URL}/item-list/index-item-list/video-list?page=1&limit=${defaultLimit}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken ?? ""}`,
            },
            next: { revalidate: 300 },
        },
    );

    const data: Res = await res.json();

    const shopRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-info/has-shop/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
        },
        cache: "no-store",
    });

    let hasShop = false;
    if (shopRes.ok) {
        const data = await shopRes.json();
        hasShop = data.hasShop;
    }

    return <Lp shopPage hasShop={hasShop} itemList={data} loggedIn={loggedIn} />;
}
