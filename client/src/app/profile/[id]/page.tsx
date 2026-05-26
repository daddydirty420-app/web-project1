import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { fetchProfileMetadata, fetchProfilePage } from "../api/server";
import { ProfilePage } from "../profilePage";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    const data = await fetchProfileMetadata(id);
    const user = data.user;

    return {
        title: `${user.user_name}`,
        description: user.user_introduction ?? `${user.user_name}のプロフィールと出品した商品をご覧いただけます。`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Profile({ params }: Props) {
    const session = await getServerSession(authOptions);

    const loggedIn = !!session?.user;
    const currentUserId = session?.user.id;

    const { id: userId } = await params;

    const data = await fetchProfilePage(userId);

    return <ProfilePage data={data} userId={userId} currentUserId={currentUserId || null} loggedIn={loggedIn} />;
}
