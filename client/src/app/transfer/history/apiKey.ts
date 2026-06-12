import { TransferHistoryResponse } from "../types";

export const getTransferHistoryApiKey = (pageIndex: number, previousPageData: TransferHistoryResponse | null) => {
    if (previousPageData && !previousPageData.hasMore) return null;

    if (pageIndex === 0) {
        return `${process.env.NEXT_PUBLIC_API_URL}/transfer/history?limit=20`;
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/transfer/history?limit=20&cursor=${previousPageData?.nextCursor}`;
};
