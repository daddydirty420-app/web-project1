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
    const cookieStore = await cookies();
    const newToken = cookieStore.get("new-token")?.value;

    console.log("cookieのaccessToken:", newToken);
    console.log("NEXT_PUBLIC_NEXTAUTH_URL:", process.env.NEXT_PUBLIC_NEXTAUTH_URL);
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

    if (newToken) {
        await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session?update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: newToken }),
        });
    }

    const session = await getServerSession(authOptions);

    console.log("session.accessToken:", session?.accessToken);

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