import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Form } from "./form";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "振込申請",
        description:
            "売上金をユーザーが指定する口座へお振込みするための申請です。ご申請いただいた売上金のお振込みは、申請日の翌々週金曜日以降となります。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!session || !accessToken) redirect("/login");

    const res = await fetch(`${process.env.API_URL}/user/transfer-request`, {
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

    return <Form user={data.user} />;
}
