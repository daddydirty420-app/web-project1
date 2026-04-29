import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { NameEditForm } from "../../../../nameEditForm";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "担当者氏名の設定・変更",
        description: "担当者氏名の変更ができます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!session || !accessToken) redirect("/login");

    const res = await fetch(`${process.env.API_URL}/shop-info-edit/${id}/con-name`, {
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

    return <NameEditForm name={data.name} page="con-com-free" shopEditId={id} />;
}
