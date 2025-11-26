import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Form from "../form";
import { cookies } from "next/headers";

type Props = {
    params: { id: string }; 
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "口座情報登録 | ショップ登録",
        description: "ショップ登録はこちら！事業者向けの複数在庫出品、在庫管理システム、売上管理システム、特別なオプションなど、申請するとショップ会員のみの特別な機能をご利用いただけます。（審査に約2週間ほどお時間を頂戴いたします。）",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page({ params }: Props) {
    const { id } = params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;
    
    if (!accessToken) redirect("/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup/signup2/${id}`, {
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
        shopId={id}
        account={data.data}
        />
    );
};