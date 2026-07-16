import { Metadata } from "next";
import { fetchUriagekinHistoryPage } from "../api/server";
import HistoryUI from "../historyUI";
import { UriagekinList } from "./uriagekinList";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "売上金履歴",
        description: "過去の売上金獲得や売上金利用の一覧をご覧いただけます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const data = await fetchUriagekinHistoryPage();

    return (
        <HistoryUI title="売上金履歴">
            <UriagekinList user={data.user} />
        </HistoryUI>
    );
}
