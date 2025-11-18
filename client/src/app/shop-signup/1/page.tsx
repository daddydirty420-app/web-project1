import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Form from "./form";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "ショップ登録 | FLEX OUTDOOR",
        description: "FLEX SHOPの登録はこちら！事業者向けの複数在庫出品、在庫管理システム、売上管理システム、特別なオプションなど、申請するとショップ会員のみの特別な機能をご利用いただけます。（審査に約2週間ほどお時間を頂戴いたします。）",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page() {
    const session = await getServerSession(authOptions);

    const isRefreshing = session?.error === "RefreshAccessTokenError";

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup/signup1`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });

    if (res.ok) {
        const data = await res.json();
        return (
            <Form
            session={session}
            user={data.data}
            shopInfo={data.shopData}
            ComOrFreeOption={data.comOrFree}
            />
        );
    }

    if (isRefreshing) {
        console.warn("accessToken更新中、notFound()スキップ");
        return (
            <div></div>
        );
    }

    const data = await res.json();
    console.error(data.message);
    notFound();
};