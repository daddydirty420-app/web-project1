import { Metadata } from "next";
import { ProfileEditForm } from "./profileEditForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { User } from "../type";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    return {
        title: `${user?.user_name} | プロフィール設定`,
        description: `${user?.user_name}のプロフィールの設定・編集ができます。`,
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

    const res = await fetch(`${process.env.API_URL}/user-edit/profile-edit`, {
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

    const userData: User = data.userData;

    return <ProfileEditForm user={userData} />;
}
