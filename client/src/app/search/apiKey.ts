import { SearchResponse } from "./type";

// limit 9 → state
export const getSearchItemListApiKey = (keyword: string, limit: number) => {
    return (pageIndex: number, previousPageData: SearchResponse) => {
        if (previousPageData && !previousPageData.hasMore) return;

        if (pageIndex === 0) {
            return `${process.env.NEXT_PUBLIC_API_URL}/items/search?keyword=${keyword}&limit=${limit}`;
        }

        return `${process.env.NEXT_PUBLIC_API_URL}/items/search?keyword=${keyword}&limit=${limit}&cursorScore=${previousPageData.nextCursorScore}&cursorId=${previousPageData.nextCursorId}`;
    };
};
