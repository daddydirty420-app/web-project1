import { Metadata } from "next";
import { fetchPointsHistoryPage } from "../api/server";
import HistoryUI from "../historyUI";
import { PointsList } from "./pointsList";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "ポイント履歴",
        description: "過去のポイント獲得やポイント利用の一覧をご覧いただけます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const data = await fetchPointsHistoryPage();

    return (
        <HistoryUI title="ポイント履歴">
            <PointsList user={data.user} />
        </HistoryUI>
    );
}
