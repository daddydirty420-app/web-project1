import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import FollowUI from "../../followUI";
import { FollowPage } from "../../followPage";

type Props = {
    params: { id: string };
    searchParams: {
        tab?: "follow" | "follower";
    };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "フォロワー一覧",
        description: "フォロー中のユーザーやフォロワーユーザーの一覧と、ユーザーのプロフィールをご覧いただけます。",
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Page({ params, searchParams }: Props) {
    const { id } = params;

    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    const tab = searchParams.tab ?? "follow";

    console.log("Page params:", params);
    console.log("Page id:", id);

    const apiUrl = tab === "follow"
    ? `${process.env.NEXT_PUBLIC_API_URL}/follow/follow-list/${id}`
    : `${process.env.NEXT_PUBLIC_API_URL}/follow/follower-list/${id}`;

    const res = await fetch(apiUrl, {
        method: "GET",
        cache: "force-cache",
        headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
        },
    });

    if (!res.ok) {
        notFound();
    }

    const data = await res.json();

    const userList = tab === "follow"
    ? data.previewFollowList
    : data.previewFollowerList;

    const myId = session?.user.id ?? "";

    const myFollow = myId === id;

    return (
        <FollowUI>
            <FollowPage
            loggedIn={!!session}
            id={id}
            currentUserId={myId}
            userList={userList}
            page="follow"
            followTab={tab}
            myFollow={myFollow}
            followCount={data.followCount}
            followerCount={data.followerCount}
            />
        </FollowUI>
    );
}