import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { CookieSet } from './cookieSet';
import { MypageElement } from './mypageElement';

type User = {
    id: number;
    user_name: string;
    profile_image: string;
    early_seller: boolean;
    honnin_verified: boolean;
    points: number;
    uriagekin: number;
};

type Res = {
    userData: {
        user: User;
        hasShop: boolean;
    };
    itemCount: number;
    soldItemCount: number;
    unreadCount: number;
    referenceCount: number;
};

export const metadata: Metadata = {
    title: "マイページ",
    description: "〇〇のマイページはこちら！ご自身のアカウントに関する情報を閲覧できます。ログインユーザーのみ！",
    robots: {
        index: false,
        follow: false
    }
};

export default async function Page() {
    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken || !session) redirect("/login");

    const res = await fetch(`${process.env.API_URL}/user/my-page/ssr`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        console.error("認証に失敗しました。", await res.text());
        redirect("/login");
    }

    const data: Res = await res.json();

    if (!data.userData || !data.userData.user) {
        console.error('ユーザーが見つかりません。');
        redirect("/login");
    }

    const profileLink = `/profile/${session?.user?.id ?? ""}`;

    return (
        <>
        <CookieSet refreshToken={session?.refreshToken} rememberMe={session?.rememberMe} />

        <MypageElement data={data} user={data.userData.user} profileLink={profileLink} />
        </>
    );
}