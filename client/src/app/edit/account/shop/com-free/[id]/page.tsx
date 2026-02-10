import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AccountEditForm } from "../../../accountEditForm";
import { cookies } from "next/headers";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "口座情報の設定・変更",
        description: "口座情報を設定・変更できます。",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page({ params }: Props) {
    const { id } = await params;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) redirect("/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-com-free/account/${id}`, {
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

    return (
        <AccountEditForm
        account={data.data.BankAccount}
        page="com-free"
        shopEditId={id}
        />
    );
};