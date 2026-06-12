import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import HistoryUI from "./historyUI";
import { TransferList } from "./transferList";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "振込申請履歴",
        description:
            "過去の振込申請の振込状況や振込金額の一覧をご覧いただけます。各振込申請の詳細はクリックしていただくとご覧いただけます。",
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
        <HistoryUI>
            <TransferList />
        </HistoryUI>
    );
}
