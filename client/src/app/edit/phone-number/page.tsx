import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchRefreshToken } from "@/lib/refreshToken";
import PhoneNumberEdit from "./phoneNumberEdit";

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
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
        try {
            const newAccessToken = await fetchRefreshToken();
            if (session) {
                session.accessToken = newAccessToken;
            }
        } catch (err) {
            console.log(err);
            notFound();
        }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-edit/phone-number`, {
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

    const phoneNumber = data.data;

    return (
        <PhoneNumberEdit
        session={session}
        user={phoneNumber}
        page="normal"
        />
    );
};