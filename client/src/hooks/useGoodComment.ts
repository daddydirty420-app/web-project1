import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

type GoodCountResponce = { count: number };

export function useGoodStatus(commentId: string) {
    return useSWR<{ isGood: boolean }>(
        `${process.env.NEXT_PUBLIC_API_URL}/good-comment/status/${commentId}`,
        fetcher, {
            revalidateIfStale: false,
            revalidateOnMount: false,
            revalidateOnFocus: false,
        }
    );
};

export function useGoodCount(commentId: string, initialCount: number) {
    return useSWR<GoodCountResponce, Error>(
        `${process.env.NEXT_PUBLIC_API_URL}/good-comment/count/${commentId}`,
        fetcher, {
            fallbackData: { count: initialCount },
            revalidateIfStale: false,
            revalidateOnMount: false,
            revalidateOnFocus: false,
        }
    );
};

export async function updateGoodCommentCache(commentId: string, nextIsGood: boolean) {
    const statusKey = `${process.env.NEXT_PUBLIC_API_URL}/good-comment/status/${commentId}`;
    const countKey = `${process.env.NEXT_PUBLIC_API_URL}/good-comment/count/${commentId}`;

    await mutate(statusKey, { isGood: nextIsGood }, false);

    await mutate(countKey, (current?: GoodCountResponce) => {
        const base = current?.count ?? 0;

        return {
            count: Math.max(0, base + (nextIsGood ? 1 : -1)),
        };
    }, false);
};