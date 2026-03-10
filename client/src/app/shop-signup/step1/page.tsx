import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Form } from "./form";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "事業者情報登録 | ショップ登録",
        description: "ショップ登録はこちら！事業者向けの複数在庫出品、在庫管理システム、売上管理システム、特別なオプションなど、申請するとショップ会員のみの特別な機能をご利用いただけます。（審査に約2週間ほどお時間を頂戴いたします。）",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page({ searchParams }: { searchParams: Record<string , string | string[] | undefined> }) {
    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!session || !accessToken) redirect("/login")

    const queryString = new URLSearchParams(
        Object.entries(searchParams).reduce((acc, [key, value]) => {
            if (typeof value === "string") {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, string>)
    ).toString();

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/shop-signup/signup1` + (queryString ? `?${queryString}` : "");

    const res = await fetch(apiUrl, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data.message);
        notFound();
    }

    return (
        <Form
        user={data.userData}
        shopInfo={data.shopData || null}
        ComOrFreeOption={data.comOrFree}
        />
    );
};