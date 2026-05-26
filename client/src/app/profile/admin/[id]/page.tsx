import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchProfileMetadata, fetchProfilePage } from "../../api/server";
import { ProfilePage } from "../../profilePage";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    const data = await fetchProfileMetadata(id);
    const user = data.user;

    return {
        title: `${user.user_name} | 管理画面`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Profile({ params }: Props) {
    const { id: userId } = await params;

    const session = await getServerSession(authOptions);

    if (!session) redirect(`/profile/${userId}`);

    const data = await fetchProfilePage(userId);

    return <ProfilePage data={data} userId={userId} currentUserId={session?.user.id ?? null} adminPage loggedIn />;
}
