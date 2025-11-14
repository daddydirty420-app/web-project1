import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchRefreshToken } from "@/lib/refreshToken";
import HonninEditForm from "./honninEditForm";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "本人確認入力フォーム | FLEX OUTDOOR",
        description: "本人確認のための個人情報等を入力するページです。※ただいま、本人確認完了後に300pt配布するキャンペーンを実施しております！",
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-edit/honnin`, {
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

    return (
        <HonninEditForm
        session={session}
        user={data.data}
        genderOptions={data.genderAllOptions}
        campaign
        />
    );
};