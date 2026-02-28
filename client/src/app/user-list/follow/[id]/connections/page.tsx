import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import FollowUI from "../../followUI";
import { UserList } from "@/app/user-list/userList";
import { FollowHeader } from "../../followHeader";

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
    const { id } = await params;

    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    const tab = (await searchParams)?.tab ?? "follow";

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

    console.log("myId", myId);
    console.log("id:", id);

    const myFollow = myId === id;

    return (
        <>
        <FollowHeader
        id={id}
        followTab={tab}
        followCount={data.followCount}
        followerCount={data.followerCount}
        />

        <FollowUI>     
            <UserList
            loggedIn={!!session}
            id={id}
            currentUserId={myId}
            userList={userList}
            page="follow"
            followTab={tab}
            myFollow={myFollow}
            />
        </FollowUI>
        </>
    );
}