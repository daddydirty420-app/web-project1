import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { NotificationList } from "./notificationList";
import NotificationUI from "./notificationUI";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "お知らせ一覧",
        description: "ユーザーに対するお知らせはこちらからご確認いただけます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    return (
        <NotificationUI>
            <NotificationList />
        </NotificationUI>
    );
}
