import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/../../server/src/auth/auth";
import { notFound } from "next/navigation";
import AddressEditForm from "./addressEditForm";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "住所の設定・変更 | FLEX OUTDOOR",
        description: "住所を設定・変更できます。",
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/address/myaddress`, {
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

    const address = data.data;

    return (
        <AddressEditForm
        session={session}
        address={address}
        page="normal"
        />
    );
};