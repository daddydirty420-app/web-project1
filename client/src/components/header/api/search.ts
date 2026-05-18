import { apiFetch } from "../../../lib/api/client";

type SearchHistoryItem = {
    search_text: string;
    createdAt: string;
};

type SearchHistoryResponse = {
    sortedData: SearchHistoryItem[];
};

export const getSearchHistory = async () => {
    const data = await apiFetch<SearchHistoryResponse>("/search/history", {
        method: "GET",
        cache: "no-store",
    });

    return data.sortedData.map((item) => item.search_text);
};
