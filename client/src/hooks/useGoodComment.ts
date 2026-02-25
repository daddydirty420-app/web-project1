import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

type GoodCountResponce = { count: number };

export function useGoodStatus(commentId: string, initialGood: boolean) {
    return useSWR<{ isGood: boolean }>(
        `${process.env.NEXT_PUBLIC_API_URL}/good-comment/status/${commentId}`,
        fetcher, {
            fallbackData: { isGood: initialGood },
            revalidateIfStale: false,
            revalidateOnMount: true,
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
            revalidateOnMount: true,
            revalidateOnFocus: false,
        }
    );
};

export async function updateGoodCommentCache(commentId: string, nextIsGood: boolean) {
    const statusKey = `${process.env.NEXT_PUBLIC_API_URL}/good-comment/status/${commentId}`;
    const countKey = `${process.env.NEXT_PUBLIC_API_URL}/good-comment/count/${commentId}`;

    await mutate(statusKey, { isGood: nextIsGood }, false);

    await mutate(countKey, (current?: GoodCountResponce) => {
        return {
            count: Math.max(0, (current?.count ?? 0) + (nextIsGood ? 1 : -1))
        };
    }, false);
};