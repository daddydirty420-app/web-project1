import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { fetchProfilePage } from "../api/profile/server";
import { ProfileEditForm } from "./profileEditForm";

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
    const data = await fetchProfilePage();

    return <ProfileEditForm user={data.user} />;
}
