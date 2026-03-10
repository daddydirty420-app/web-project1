import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AccountEditForm } from "../accountEditForm";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "口座情報の設定・変更",
        description: "口座情報を設定・変更できます。（当ページだけではなく、振込申請時にも振込口座の変更が可能です。）",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page() {    
    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!session || !accessToken) redirect("/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank-account/myaccount`, {
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

    const account = data.data;

    return (
        <AccountEditForm
        account={account}
        page="transfar"
        />
    );
};