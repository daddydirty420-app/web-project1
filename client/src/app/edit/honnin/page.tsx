import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { HonninEditForm } from "./honninEditForm";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "本人確認入力フォーム",
        description:
            "本人確認のための個人情報等を入力するページです。※ただいま、本人確認完了後に300pt配布するキャンペーンを実施しております！",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) redirect("/login");

    const res = await fetch(`${process.env.API_URL}/user/honnin`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data.code);
        notFound();
    }

    return <HonninEditForm user={data.user} genderOptions={data.genderAllOptions} campaign />;
}
