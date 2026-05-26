import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchAdminItemPage, fetchItemMetadata } from "../../api/server";
import { ItemPage } from "../../itemPage";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    const data = await fetchItemMetadata(id);
    const item = data.item;

    return {
        title: `${item.name} | 管理画面`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session) redirect(`/item/${id}`);

    const data = await fetchAdminItemPage(id);

    return (
        <ItemPage
            id={id}
            item={data.item}
            page="admin"
            commentCount={data.commentCount}
            likeCount={data.likeCount}
            reportCount={data.reportCount}
            userId={session?.user.id ?? null}
            loggedIn
        />
    );
}
