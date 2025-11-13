import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/../../server/src/auth/auth";
import { notFound } from "next/navigation";
import NameEditForm from "./nameEditForm";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "氏名の設定・変更 | FLEX OUTDOOR",
        description: "氏名を設定・変更できます。（ユーザーネーム等プロフィールの変更ではございません。）",
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/name/myname`, {
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

    const name = data.data;

    return (
        <NameEditForm
        session={session}
        name={name}
        page="normal"
        />
    );
};