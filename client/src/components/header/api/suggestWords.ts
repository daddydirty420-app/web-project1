import { apiFetch } from "../../../lib/api/client";

type SuggestWordsResponse = {
    suggest: string[];
};

export const getSuggestWords = async (keyword: string) => {
    const data = await apiFetch<SuggestWordsResponse>(`/suggest-words?keyword=${keyword}`, {
        method: "GET",
        cache: "no-store",
    });

    return data.suggest;
};
