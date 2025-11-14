import { Metadata } from "next";
import ProfileEditForm from "./profileEditForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchRefreshToken } from "@/lib/refreshToken";
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