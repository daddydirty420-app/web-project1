import { PointsHistoryResponse } from "../type";

export const getPointsHistoryApiKey = (pageIndex: number, previousPageData: PointsHistoryResponse | null) => {
    if (previousPageData && !previousPageData.hasMore) return null;

    if (pageIndex === 0) {
        return `${process.env.NEXT_PUBLIC_API_URL}/points-history?limit=30`;
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/points-history?limit=30&cursor=${previousPageData?.nextCursor}`;
};
