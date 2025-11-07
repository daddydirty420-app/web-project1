import { Metadata } from 'next';
import ProfilePage from '../profilePage';
import { Res } from '../profileTypes';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
        title: `${user.user_name} | FLEX OUTDOOR`,
        description: user.user_introduction ?? `${user.user_name}のプロフィールと出品した商品をご覧いただけます。`,
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Profile({ params }: Props) {
    const defaultLimit = 15;
    const session = await getServerSession(authOptions);

    const { id: userId } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile/${userId}?limit=${defaultLimit}`, {
        method: 'GET',
        cache: 'no-store'
    });

    const data: Res = await res.json();

    return <ProfilePage data={data} userId={userId} session={session} />;
};