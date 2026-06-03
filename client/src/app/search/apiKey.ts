import { SearchResponse } from "./type";

// limit 9 → state
export const getSearchItemListApiKey = (limit: number) => {
    return (pageIndex: number, previousPageData: SearchResponse) => {
        if (previousPageData && !previousPageData.hasMore) return;

        if (pageIndex === 0) {
            return `${process.env.NEXT_PUBLIC_API_URL}/dev/items?limit=${limit}`;
        }

        return `${process.env.NEXT_PUBLIC_API_URL}/dev/items?limit=${limit}&cursor=${previousPageData.nextCursor}`;
    };
};
