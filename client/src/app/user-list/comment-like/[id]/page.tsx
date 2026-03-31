import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GoodUI from "../../goodUI";
import { UserList } from "../../userList";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "いいねしたユーザー",
        description: "いいねしたユーザーの一覧と、ユーザーのプロフィールをご覧いただけます。",
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Page({ params }: Props) {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    
    if (!session) redirect("/login");
    
    return (
        <GoodUI title="いいねしたユーザー">
            <UserList
            loggedIn={!!session}
            id={id}
            currentUserId={session?.user.id ?? ""}
            page="comment-like"
            />
        </GoodUI>
    );
}