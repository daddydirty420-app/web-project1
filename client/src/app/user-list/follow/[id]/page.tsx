import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { UserList } from "../../userList";
import { FollowHeader } from "../followHeader";
import FollowUI from "../followUI";
import { fetchFollowCount } from "../../api/server";

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
            follow: false,
        },
    };
}

export default async function Page({ params, searchParams }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    const tab = (await searchParams)?.tab ?? "follow";

    const data = await fetchFollowCount(id);

    const myId = session?.user.id ?? "";

    const myFollow = String(myId) === String(id);

    return (
        <>
            <FollowHeader id={id} followTab={tab} followCount={data.followCount} followerCount={data.followerCount} />

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
