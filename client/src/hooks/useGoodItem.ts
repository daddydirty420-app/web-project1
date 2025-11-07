import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

type GoodCountResponce = { count: number };

export function useGoodStatus(itemId: string, accessToken: string) {
    return useSWR<{ isGood: boolean }>(
        `${process.env.NEXT_PUBLIC_API_URL}/good-item/status/${itemId}`,
        fetcher(accessToken), {
            revalidateIfStale: false,
            revalidateOnMount: false,
            revalidateOnFocus: false,
        }
    );
};

export function useGoodCount(itemId: string, accessToken: string) {
    return useSWR<GoodCountResponce, Error>(
        `${process.env.NEXT_PUBLIC_API_URL}/good-item/count/${itemId}`,
        fetcher(accessToken), {
            revalidateIfStale: false,
            revalidateOnMount: false,
            revalidateOnFocus: false,
        }
    );
};

export async function updateGoodItemCache(itemId: string, isGood: boolean) {
    mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/good-item/status/${itemId}`,
        { isGood },
        false
    );
    mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/good-item/count/${itemId}`,
        (currentData?: GoodCountResponce) => {
            if (!currentData) return { count: 1 };
            return { count: isGood ? currentData.count + 1 : Math.max(0, currentData.count - 1) };
        },
        false
    );

    mutate(`${process.env.NEXT_PUBLIC_API_URL}/good-item/status/${itemId}`);
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/good-item/count/${itemId}`);
};