'use client';

import { useFollowStatus, updateFollowCache } from '@/hooks/useFollow';
import styles from './followButton.module.css';
import clsx from 'clsx';
import { refreshToken } from '@/lib/refreshToken';

type Props = {
    targetUserId: string;
    currentUserId: string | null;
};

export const FollowButton = ({ targetUserId, currentUserId }: Props) => {
    const { data: status } = useFollowStatus(targetUserId);

    if (!currentUserId || !targetUserId) return null;

    const add = async () => {
        updateFollowCache(targetUserId, currentUserId, true);

        try {
            const accessToken = await refreshToken();
        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/${targetUserId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

        } catch (err) {
            // ロールバック
            updateFollowCache(targetUserId, currentUserId, false);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const remove = async () => {
        updateFollowCache(targetUserId, currentUserId, false);

        try {
            const accessToken = await refreshToken();
        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/${targetUserId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

        } catch (err) {
            updateFollowCache(targetUserId, currentUserId, true);
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