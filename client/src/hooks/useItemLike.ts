import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

type LikeCountResponse = { count: number };

export function useLikeStatus(itemId: string) {
    return useSWR<{ isGood: boolean }>(
        `${process.env.NEXT_PUBLIC_API_URL}/item-like/${itemId}/status`,
        fetcher
    );
};

export function useLikeCount(itemId: string) {
    return useSWR<LikeCountResponse, Error>(
        `${process.env.NEXT_PUBLIC_API_URL}/item-like/${itemId}/count`,
        fetcher,
    );
};

export async function updateItemLikeCache(itemId: string, isGood: boolean) {
    const statusKey = `${process.env.NEXT_PUBLIC_API_URL}/item-like/${itemId}/status`;
    const countKey = `${process.env.NEXT_PUBLIC_API_URL}/item-like/${itemId}/count`;

    await mutate(statusKey, { isGood }, false);

    await mutate(countKey, (current?: LikeCountResponse) => {
        if (!current) return current;
        return {
            ...current,
            count: isGood
            ? current.count + 1
            : Math.max(0, current.count - 1)
        };
    }, false);
};