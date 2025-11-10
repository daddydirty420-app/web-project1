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
    const user = session?.user;
    if (!session || !user) {
        notFound();
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-info/com-or-free`);

    const data = await res.json();

    if (!res.ok) {
        console.error(data.message);
        notFound();
    }

    return (
        <Form
        session={session}
        ComOrFreeOption={data.data}
        />
    );
}