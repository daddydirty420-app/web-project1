import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Form from "./form";
import { cookies } from "next/headers";

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

    console.log("session.accessToken:", session?.accessToken);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    console.log("cookieのaccessToken:", accessToken);

    if (!session?.accessToken) {
        redirect("/login");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup/signup1`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        if (res.status === 401) {
            redirect("/shop-signup/1"); 
        }
        console.error(data.message);
        notFound();
    }

    return (
        <Form
        session={session}
        user={data.data}
        shopInfo={data.shopData}
        ComOrFreeOption={data.comOrFree}
        />
    );
};