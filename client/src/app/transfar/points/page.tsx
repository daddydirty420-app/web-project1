import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Form from "./form";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "ポイントに変換 | FLEX OUTDOOR",
        description: "売上金をポイントに変換できます。ポイントの有効期限は、変換日から180日後になります。",
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/transfar-points`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${session?.accessToken ?? ""}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data.messaage);
        notFound();
    }

    return (
        <Form
        session={session}
        user={data.user}
        reccomendPayValue={data.minValue}
        />
    );
};