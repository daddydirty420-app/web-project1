import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Form } from '../form';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: '事業形態の変更',
        description: '事業形態を変更できます。（事業形態の変更には審査が必要になります。）',
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!session || !accessToken) redirect('/login');

    const res = await fetch(`${process.env.API_URL}/shop-com-free/com-free/${id}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data.message);
        notFound();
    }

    return <Form shopId={id} shopInfo={data.shop} ComOrFreeOption={data.comFree} />;
}
