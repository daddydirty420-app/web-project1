import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PhoneNumberEdit from "./phoneNumberEdit";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "電話番号の設定・変更 | FLEX OUTDOOR",
        description: "電話番号を設定・変更できます。",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) redirect("/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-edit/phone-number`, {
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

    return (
        <PhoneNumberEdit
        accessToken={accessToken}
        user={phoneNumber}
        page="normal"
        />
    );
};