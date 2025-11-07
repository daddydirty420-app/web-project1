import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import NameEditForm from "../../nameEditForm";
import { Name } from "../../../type";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "氏名の設定・変更 | FLEX OUTDOOR",
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
    const user = session?.user;
    if (!session || !user) {
        notFound();
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/name/delivery-name/${id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${session?.accessToken ?? ""}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data.message);
        notFound();
    }

    const name: Name = data.data;

    return (
        <NameEditForm
        session={session}
        name={name}
        page="delivery"
        deliveryId={id}
        />
    );
};