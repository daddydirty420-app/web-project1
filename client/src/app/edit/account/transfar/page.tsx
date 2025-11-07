import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import AccountEditForm from "../accountEditForm";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "口座情報の設定・変更 | FLEX OUTDOOR",
        description: "口座情報を設定・変更できます。（当ページだけではなく、振込申請時にも振込口座の変更が可能です。）",
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank-account/myaccount`, {
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

    const account = data.data;

    return (
        <AccountEditForm
        session={session}
        account={account}
        page="transfar"
        />
    );
};