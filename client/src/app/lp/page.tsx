import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { SITE } from "../../config/site";
import { fetchLpVideoList } from "./api/server";
import { Lp } from "./lp";

export const metadata: Metadata = {
    title: SITE.appName,
    description: `自慢のギアを動画で自慢！全く新しいアウトドア専門フリマ「${SITE.appName}」。新品からヴィンテージ品まで、動画だから商品の魅力から使い方、状態まで一目瞭然！アウトドア好き同士がつながる、新しい売買体験を！`,
    robots: {
        index: false,
        follow: false,
    },
};

export default async function Page() {
    const session = await getServerSession(authOptions);
    const loggedIn = !!session?.user;

    const data = await fetchLpVideoList();

    return <Lp itemList={data} loggedIn={loggedIn} />;
}
