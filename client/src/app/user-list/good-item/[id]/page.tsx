import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import { UserListPage } from "../../userListPage";

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

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;
    
    if (!accessToken) redirect("/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/good-item/good-user-list/${id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        notFound();
    }

    const data = await res.json();

    return <UserListPage
    title="いいねしたユーザー"
    loggedIn={!!session}
    id={id}
    currentUserId={session?.user.id ?? ""}
    userList={data.userList ?? []}
    userCount={data.userCount ?? 0}
    page="good-item"
    />;
}