import { SearchResponse } from "./type";

// limit 9 → state
export const getSearchItemListApiKey = (pageIndex: number, previousPageData: SearchResponse) => {
    if (previousPageData && !previousPageData.hasMore) return;

    if (pageIndex === 0) {
        return `${process.env.NEXT_PUBLIC_API_URL}/dev/items?limit=9`;
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/dev/items?limit=9&cursor=${previousPageData.nextCursor}`;
};
