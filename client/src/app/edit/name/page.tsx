import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NameEditForm } from "./nameEditForm";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "氏名の設定・変更",
        description: "氏名を設定・変更できます。（ユーザーネーム等プロフィールの変更ではございません。）",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) redirect("/login");

    const res = await fetch(`${process.env.API_URL}/name/myname`, {
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

    const name = data.data;

    return <NameEditForm name={name} page="normal" />;
}
