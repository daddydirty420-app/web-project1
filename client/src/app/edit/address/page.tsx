import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { AddressEditForm } from './addressEditForm';
import { cookies } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: '住所の設定・変更',
        description: '住所を設定・変更できます。',
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) redirect('/login');

    const res = await fetch(`${process.env.API_URL}/address/myaddress`, {
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

    const address = data.data;

    return <AddressEditForm address={address} page="normal" />;
}
