"use client";

import useSWRInfinite from "swr/infinite";
import { fetcher } from "../../../lib/fetcher";
import { TransferHistoryResponse } from "../types";
import { getTransferHistoryApiKey } from "./apiKey";

export const TransferList = () => {
    // SWRInfinite
    const { data, mutate, size, setSize, isValidating } = useSWRInfinite<TransferHistoryResponse>(
        getTransferHistoryApiKey,
        async (url: string) => {
            return fetcher<TransferHistoryResponse>(url);
        },
    );

    const history = data?.flatMap((page) => page.history) ?? [];

    // 追加フェッチ

    // 最下部検知

    return <></>;
};
