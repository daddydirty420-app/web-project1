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
    mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/good-comment/status/${commentId}`,
        { isGood },
        false
    );
    mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/good-comment/count/${commentId}`,
        (currentData?: GoodCountResponce) => {
            if (!currentData) return { count: 1 };
            return { count: isGood ? currentData.count + 1 : Math.max(0, currentData.count - 1) };
        },
        false
    );

    mutate(`${process.env.NEXT_PUBLIC_API_URL}/good-comment/status/${commentId}`);
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/good-comment/count/${commentId}`);
};