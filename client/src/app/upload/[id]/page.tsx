import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Form } from '../form';

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: '商品を出品する',
        description: '商品の出品はこちら！',
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

    const res = await fetch(`${process.env.API_URL}/items/${id}/form-data`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        notFound();
    }

    const data = await res.json();
    const item = data.item;
    const category = data.category;
    const allCondition = data.allCondition;
    const allDay = data.allDay;
    const allService = data.allService;
    const allPlace = data.allPlace;
    const hasShop = data.hasShop;

    const userId = String(session?.user.id).trim();
    const sellerId = String(item.seller_id).trim();

    if (userId !== sellerId) {
        redirect('/upload/before');
    }

    if (item.status !== 'editing') {
        redirect('/upload/before');
    }

    return (
        <Form
            itemId={id}
            item={item}
            category={category}
            allCondition={allCondition}
            allDay={allDay}
            allService={allService}
            allPlace={allPlace}
            hasShop={hasShop}
            page="normal"
        />
    );
}
