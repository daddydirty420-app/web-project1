import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

type GoodCountResponce = { count: number };

export function useGoodStatus(commentId: string) {
    return useSWR<{ isGood: boolean }>(
        `${process.env.NEXT_PUBLIC_API_URL}/good-comment/status/${commentId}`,
        fetcher(), {
            revalidateIfStale: false,
            revalidateOnMount: false,
            revalidateOnFocus: false,
        }
    );
};

export function useGoodCount(commentId: string) {
    return useSWR<GoodCountResponce, Error>(
        `${process.env.NEXT_PUBLIC_API_URL}/good-comment/count/${commentId}`,
        fetcher(), {
            revalidateIfStale: false,
            revalidateOnMount: false,
            revalidateOnFocus: false,
        }
    );
};

export async function updateGoodCommentCache(commentId: string, isGood: boolean) {
    const statusKey = `${process.env.NEXT_PUBLIC_API_URL}/good-comment/status/${commentId}`;
    const countKey = `${process.env.NEXT_PUBLIC_API_URL}/good-comment/count/${commentId}`;

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