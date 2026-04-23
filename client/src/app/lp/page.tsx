import { authOptions } from "@/lib/auth";
import { Items } from "@/types/itemListTypes";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { Lp } from "./lp";

type Res = {
    items: Items[];
    totalPages: number;
};

export const metadata: Metadata = {
    title: "○○",
    description:
        "自慢のギアを動画で自慢！全く新しいアウトドア専門フリマ「○○」。新品からヴィンテージ品まで、動画だから商品の魅力から使い方、状態まで一目瞭然！アウトドア好き同士がつながる、新しい売買体験を！",
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

    const res = await fetch(`${process.env.API_URL}/items?type=video&page=1&view=index&limit=${defaultLimit}`, {
        method: "GET",
        headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        next: { revalidate: 300 },
    });

    const data: Res = await res.json();

    return <Lp itemList={data || null} loggedIn={loggedIn} />;
}
