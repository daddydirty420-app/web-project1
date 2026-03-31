import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

type GoodCountResponce = { count: number };

export function useGoodStatus(commentId: string,) {
    return useSWR<{ isGood: boolean }>(
        `${process.env.NEXT_PUBLIC_API_URL}/comment-like/status/${commentId}`,
        fetcher,
    );
};

export function useGoodCount(commentId: string) {
    return useSWR<GoodCountResponce, Error>(
        `${process.env.NEXT_PUBLIC_API_URL}/comment-like/count/${commentId}`,
        fetcher,
    );
};

export async function updateCommentLikeCache(commentId: string, isGood: boolean) {
    const statusKey = `${process.env.NEXT_PUBLIC_API_URL}/comment-like/status/${commentId}`;
    const countKey = `${process.env.NEXT_PUBLIC_API_URL}/comment-like/count/${commentId}`;

    await mutate(statusKey, { isGood }, false);

    await mutate(countKey, (current?: GoodCountResponce) => {
        if (!current) return current;
        return {
            ...current,
            count: isGood
            ? current.count + 1
            : Math.max(0, current.count - 1)
        };
    }, false);
};