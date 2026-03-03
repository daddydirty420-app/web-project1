import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import FollowUI from "../followUI";
import { UserList } from "../../userList";
import { FollowHeader } from "../followHeader";

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

    const tab = (await searchParams)?.tab ?? "follow";

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/count/${id}`, {
        method: "GET",
        cache: "force-cache",
    });

    if (!res.ok) {
        notFound();
    }

    const data = await res.json();

    const myId = session?.user.id ?? "";

    const myFollow = String(myId) === String(id);

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
            page="follow"
            followTab={tab}
            myFollow={myFollow}
            />
        </FollowUI>
        </>
    );
}