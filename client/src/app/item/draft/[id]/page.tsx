import { Metadata } from "next";
import ItemPage from "../../itemPage";
import { Item } from "../../itemPageTypes";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchRefreshToken } from "@/lib/refreshToken";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/metadata/${id}`,{
        method: 'GET',
        cache: 'no-store'
    });

    const item: Item = await res.json();

    return {
        title: `${item.name} | 下書き`,
        description: `「${item.name}」の下書き`,
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
        try {
            const newAccessToken = await fetchRefreshToken();
            if (session) {
                session.accessToken = newAccessToken;
            }
        } catch (err) {
            console.log(err);
            redirect(`/item/${id}`);
        }
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/draft-confirm-deleted/${id}?page=draft`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${session?.accessToken ?? ""}`,
        },
    });

    if (!res.ok) {
        notFound();
    }

    const data = await res.json();
    const item: Item = data.item;

    const sessionId = String(session?.user?.id).trim();
    const sellerId = String(item.seller_id).trim();

    if (sessionId !== sellerId) {
        redirect(`/item/${id}`);
    }

    return <ItemPage
    id={id}
    item={item}
    page="draft"
    session={session}
    sellerMe
    />
};