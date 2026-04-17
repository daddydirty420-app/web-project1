import { Metadata } from 'next';
import { ProfilePage } from '../../profilePage';
import type { Res } from '../../profileTypes';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const res = await fetch(`${process.env.API_URL}/user/${id}/profile/metadata`, {
        method: 'GET',
        cache: 'no-store',
    });

    const data = await res.json();
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

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken || !session) redirect(`/profile/${userId}`);

    const defaultLimit = 15;

    const res = await fetch(`${process.env.API_URL}/user/${userId}/profile?limit=${defaultLimit}`, {
        method: 'GET',
        cache: 'no-store',
    });

    const data: Res = await res.json();

    const currentUserId = session?.user.id;

    return <ProfilePage data={data} userId={userId} currentUserId={currentUserId ?? ''} adminPage loggedIn />;
}
