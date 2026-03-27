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
        `${process.env.NEXT_PUBLIC_API_URL}/follow/${targetUserId}/status`,
        fetcher,
    );
}

export function useFollowCount(userId: string) {
    return useSWR<FollowCountResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/follow/${userId}/count`,
        fetcher,
    );
}

export async function updateFollowCache(
    targetUserId: string, 
    userId: string, 
    isFollowing: boolean, 
) {
    const statusKey = `${process.env.NEXT_PUBLIC_API_URL}/follow/${targetUserId}/status`;
    const myCountKey = `${process.env.NEXT_PUBLIC_API_URL}/follow/${userId}/count`;
    const targetCountKey = `${process.env.NEXT_PUBLIC_API_URL}/follow/${targetUserId}/count`;

    // 即キャッシュ更新
    await mutate(statusKey, { isFollowing }, false);

    await mutate(myCountKey, (current?: FollowCountResponse) => {
        if (!current) return current;
        return {
            ...current,
            followCount: isFollowing
            ? current.followCount + 1
            : Math.max(0, current.followCount - 1)
        };
    }, false);

    await mutate(targetCountKey, (current?: FollowCountResponse) => {
        if (!current) return current;
        return {
            ...current,
            followCount: isFollowing
            ? current.followCount + 1
            : Math.max(0, current.followCount - 1)
        };
    }, false);
}