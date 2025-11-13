import { Metadata } from "next";
import ItemPage from "../../itemPage";
import { Item } from "../../itemPageTypes";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/../../server/src/auth/auth";

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
        title: `${item.name} | 管理画面`,
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user.admin) {
        redirect(`/item/${id}`);
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page-admin/${id}`, {
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
    const commentCount: number = data.commentCount;
    const goodCount: number = data.goodCount;
    const reportCount: number = data.reportCount;

    return <ItemPage
    id={id}
    item={item}
    page="admin"
    session={session}
    commentCount={commentCount}
    goodCount={goodCount}
    reportCount={reportCount}
    />;
};