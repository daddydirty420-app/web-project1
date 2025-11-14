import { Metadata } from 'next';
import ProfilePage from '../../profilePage';
import type { Res } from '../../profileTypes';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { fetchRefreshToken } from '@/lib/refreshToken';

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile/metadata/${id}`,
        {
            method: 'GET',
            cache: 'no-store'
        }
    );

    const user = await res.json();

    return {
        title: `${user.user_name} | 管理画面`,
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Profile({ params }: Props) {
    const { id: userId } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
        try {
            const newAccessToken = await fetchRefreshToken();
            if (session) {
                session.accessToken = newAccessToken;
            }
        } catch (err) {
            console.log(err);
            redirect(`/profile/${userId}`);
        }
    }

    const defaultLimit = 15;

    const admin = session?.user.admin;
    if (!admin) {
        redirect(`/profile/${userId}`);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile/${userId}?limit=${defaultLimit}`, {
        method: 'GET',
        cache: 'no-store'
    });

    const data: Res = await res.json();

    return <ProfilePage data={data} userId={userId} adminPage session={session} />;
};