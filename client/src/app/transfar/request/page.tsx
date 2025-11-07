import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import Form from "./form";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "振込申請 | FLEX OUTDOOR",
        description: "売上金をユーザーが指定する口座へお振込みするための申請です。ご申請いただいた売上金のお振込みは、申請日の翌々週金曜日以降となります。",
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/transfar-request`, {
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

    return (
        <Form
        session={session}
        user={data.user}
        reccomendPayValue={data.minValue}
        />
    );
};