import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PhoneNumberEdit } from "./phoneNumberEdit";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "電話番号の設定・変更",
        description: "電話番号を設定・変更できます。",
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

    const res = await fetch(`${process.env.API_URL}/user-edit/phone-number`, {
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

    const phoneNumber = data.data;

    return <PhoneNumberEdit user={phoneNumber} page="normal" />;
}
