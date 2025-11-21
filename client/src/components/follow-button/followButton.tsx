'use client';

import { useFollowStatus, updateFollowCache } from '@/hooks/useFollow';
import styles from './followButton.module.css';
import clsx from 'clsx';
import { Session } from 'next-auth';

type Props = {
    targetUserId: string;
    withCount?: boolean;
    session: Session | null;
    accessToken: string | null;
};

export default function FollowButton({ targetUserId, withCount, session, accessToken }: Props) {
    const currentUserId = session?.user?.id;

    const { data: status } = useFollowStatus(targetUserId, accessToken ?? "");
    if (!accessToken) return null;

    if (!currentUserId || !targetUserId) return null;

    const add = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/add/${targetUserId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken ?? ""}`,
            },
        });
        updateFollowCache(targetUserId, currentUserId, true, withCount ?? true);
    }

    const remove = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/remove/${targetUserId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken ?? ""}`,
            },
        });
        updateFollowCache(targetUserId, currentUserId, false, withCount ?? true);
    }

    if (!currentUserId) {
        return <button type='button'>Loading...</button>
    }
    const currentIdStr = currentUserId.toString();

    return (
        <>
        {currentUserId && currentIdStr !== targetUserId && (
            <>
            {!status?.isFollowing && (
                <button type='button' name='follow-button' className={clsx(styles.followButton, styles.false)} onClick={add}>フォローする</button>
            )}
            {status?.isFollowing && (
                <button type='button' name='follow-button' className={clsx(styles.followButton, styles.true)} onClick={remove}>フォロー中</button>
            )}
            </>
        )}
        </>
    )
}