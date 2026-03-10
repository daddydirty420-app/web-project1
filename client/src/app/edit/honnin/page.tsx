import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HonninEditForm } from "./honninEditForm";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "本人確認入力フォーム",
        description: "本人確認のための個人情報等を入力するページです。※ただいま、本人確認完了後に300pt配布するキャンペーンを実施しております！",
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-edit/honnin`, {
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
        <HonninEditForm
        user={data.data}
        genderOptions={data.genderAllOptions}
        campaign
        />
    );
};