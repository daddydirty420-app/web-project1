"use client";

import { useState } from "react";
import { PointsHistoryResponse, User } from "./type";
import { fetcher } from "../../../lib/fetcher";
import { getPointsHistoryApiKey } from "./apiKey";
import useSWRInfinite from "swr/infinite";

type Props = {
    user: User;
};

export const PointsList = ({ user }: Props) => {
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // SWRInfinite
    const { data, mutate, size, setSize, isValidating } = useSWRInfinite<PointsHistoryResponse>(
        getPointsHistoryApiKey,
        async (url: string) => {
            return fetcher<PointsHistoryResponse>(url);
        },
    );

    const history = data?.flatMap((page) => page.history) ?? [];

    // 追加フェッチ

    // 最下部検知
};
