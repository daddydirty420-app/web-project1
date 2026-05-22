import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Client } from "../client";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "事業者情報の確認・変更",
        description: "事業形態を変更に伴う事業者情報の変更ができます。（事業形態の変更には審査が必要になります。）",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) redirect("/login");

    const res = await fetch(`${process.env.API_URL}/shop-info-edit/${id}/com-free-confirm`, {
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

    const shopEdit = data.shopEdit;

    return (
        <Client shopId={shopEdit.ShopInfo.id} shopInfo={shopEdit.ShopInfo} shopEditId={id} shopInfoEdit={shopEdit} />
    );
}
