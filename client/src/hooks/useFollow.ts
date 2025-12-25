import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';

type FollowStatus = {
    isFollowing: boolean;
}

type FollowCountResponse = {
    followCount: number;
    followerCount: number;
}

export function useFollowStatus(targetUserId: string) {
    return useSWR<FollowStatus>(
        `${process.env.NEXT_PUBLIC_API_URL}/follow/status?to=${targetUserId}`,
        fetcher(),
    );
}

export function useFollowCount(userId: string) {
    return useSWR<FollowCountResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/follow/count/${userId}`,
        fetcher(),
    );
}

export async function updateFollowCache(targetUserId: string, userId: string, isFollowing: boolean, withCount: boolean = true) {
    mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/follow/status?to=${targetUserId}`,
        { isFollowing },
        false
    );
    mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/follow/count/${userId}`,
        (currentData?: { followCount: number; followerCount: number }) => {
            if (!currentData) {
                return { followCount: 0, followerCount: 0 };
            };
            return {
                followCount: isFollowing 
                ? currentData.followCount + 1 
                : Math.max(0, currentData.followCount - 1),
                followerCount: currentData.followerCount,
            }
        },
        false
    );
    mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/follow/count/${targetUserId}`,
        (currentData?: { followCount: number; followerCount: number }) => {
            if (!currentData) {
                return { followCount: 0, followerCount: 0 };
            };
            return {
                followCount: currentData.followCount,
                followerCount: isFollowing
                ? currentData.followerCount + 1
                : Math.max(0, currentData.followerCount - 1),
            }
        },
        false
    );

    mutate(`${process.env.NEXT_PUBLIC_API_URL}/follow/status?to=${targetUserId}`);
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/follow/count/${userId}`);
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/follow/count/${targetUserId}`);
}