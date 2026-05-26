import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { fetchAccessLog, fetchItemMetadata, fetchItemPage, fetchRecommend } from "../api/server";
import { ItemPage } from "../itemPage";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    const data = await fetchItemMetadata(id);
    const item = data.item;

    return {
        title: `${item.name}`,
        description: `${item.name}: ${item.price}, ${item.Video?.title}: ${item.Video?.summary}`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    const data = await fetchItemPage(id);

    const recommendData = await fetchRecommend(id);

    fetchAccessLog(id);

    return (
        <ItemPage
            id={id}
            item={data.item}
            itemList={recommendData.items ?? []}
            sellerMe={data.sellerMe}
            page="normal"
            commentCount={data.commentCount}
            likeCount={data.likeCount}
            isLike={data.isLikeByMe}
            userId={session?.user.id ?? null}
            loggedIn={!!session?.user}
            me={data.me}
        />
    );
}
