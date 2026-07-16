"use client";

import { useInfinitePagination } from "../../../hooks/useInfinitePagination";
import { getUriagekinHistoryApiKey } from "../apiKey";
import { UriagekinHistory, UriagekinHistoryResponse, User } from "../type";

type Props = {
    user: User;
};

export const UriagekinList = ({ user }: Props) => {
    // 無限スクロール
    const { items: history, loadMoreRef } = useInfinitePagination<UriagekinHistoryResponse, UriagekinHistory>({
        apiKey: getUriagekinHistoryApiKey,
        getItems: (page) => page.history,
        hasMore: (page) => page.hasMore,
    });

    const uriagekinLots = user.UriagekinLots;
};
