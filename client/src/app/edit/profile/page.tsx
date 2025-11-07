import { Metadata } from "next";
import ProfileEditForm from "./profileEditForm";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import { User } from "../type";

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
};

export default async function Page() {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !user) {
        notFound();
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-edit/profile-edit`, {
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

    const userData: User = data.userData;

    return (
        <ProfileEditForm session={session} user={userData} />
    );
};