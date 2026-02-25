'use client';

import { useFollowStatus, updateFollowCache } from '@/hooks/useFollow';
import styles from './followButton.module.css';
import clsx from 'clsx';
import { refreshToken } from '@/lib/refreshToken';

type Props = {
    targetUserId: string;
    withCount?: boolean;
    currentUserId: string | null;
};

export const FollowButton = ({ targetUserId, withCount, currentUserId }: Props) => {
    const { data: status } = useFollowStatus(targetUserId);

    if (!currentUserId || !targetUserId) return null;

    const add = async () => {
        try {
            const accessToken = await refreshToken();
        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/add/${targetUserId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            updateFollowCache(targetUserId, currentUserId, true, withCount ?? true);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const remove = async () => {
        try {
            const accessToken = await refreshToken();
        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/remove/${targetUserId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            updateFollowCache(targetUserId, currentUserId, false, withCount ?? true);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

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
    );
}