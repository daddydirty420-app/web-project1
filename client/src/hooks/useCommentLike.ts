import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

type LikeCountResponse = { count: number };

export function useLikeStatus(commentId: string) {
    return useSWR<{ isGood: boolean }>(`${process.env.NEXT_PUBLIC_API_URL}/comment-like/${commentId}/status`, fetcher);
}

export function useLikeCount(commentId: string) {
    return useSWR<LikeCountResponse, Error>(
        `${process.env.NEXT_PUBLIC_API_URL}/comment-like/${commentId}/count`,
        fetcher,
    );
}

export async function updateCommentLikeCache(commentId: string, isGood: boolean) {
    const statusKey = `${process.env.NEXT_PUBLIC_API_URL}/comment-like/${commentId}/status`;
    const countKey = `${process.env.NEXT_PUBLIC_API_URL}/comment-like/${commentId}/count`;

    await mutate(statusKey, { isGood }, false);

    await mutate(
        countKey,
        (current?: LikeCountResponse) => {
            if (!current) return current;
            return {
                ...current,
                count: isGood ? current.count + 1 : Math.max(0, current.count - 1),
            };
        },
        false,
    );
}
