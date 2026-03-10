import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NameEditForm } from "../../../../nameEditForm";
import { Name } from "../../../../../type";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "氏名の設定・変更",
        description: "配送情報に記載する氏名の変更ができます。",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page({ params }: Props) {
    const { id } = await params;
            
    const session = await getServerSession(authOptions);
    
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;
    
    if (!session || !accessToken) redirect("/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-info-edit/con-name/${id}`, {
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

    const name: Name = data.name;

    return (
        <NameEditForm
        name={name}
        page="con-shop-signup"
        shopId={id}
        />
    );
};