'use client';

import styles from './comment.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbUpRegular } from '@fortawesome/free-regular-svg-icons';
import { Comment } from '../itemPageTypes';
import { updateCommentLikeCache, useLikeCount, useLikeStatus } from '@/hooks/useCommentLike';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/getAccessToken';

type Props = {
    comment: Comment;
    loggedIn: boolean;
};

export const Like = ({ comment, loggedIn }: Props) => {
    const id = comment.id;
    const initialCount = comment.goodCount;
    const isMyComment = comment.isMyComment;
    const { data: goodStatus } = useLikeStatus(id);
    const { data: goodCount } = useLikeCount(id);
    const router = useRouter();

    const good = goodStatus?.isGood ?? false;
    const count = goodCount?.count ?? initialCount ?? 0;

    const add = async () => {
        updateCommentLikeCache(id, true);

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert('認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。');
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment-like/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            updateCommentLikeCache(id, false);
            alert('システムエラーが発生しました。時間をおいて再試行してください。');
            console.error(err);
        }
    };

    const remove = async () => {
        updateCommentLikeCache(id, false);

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert('認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。');
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment-like/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            updateCommentLikeCache(id, true);
            alert('システムエラーが発生しました。時間をおいて再試行してください。');
            console.error(err);
        }
    };

    const userList = () => isMyComment && router.push(`/user-list/comment-like/${id}`);

    return (
        <div className={styles.goodDiv} onClick={userList}>
            {loggedIn && !isMyComment && (
                <>
                    {good ? (
                        <FontAwesomeIcon
                            icon={faThumbsUpSolid}
                            className={clsx(styles.goodIcon, styles.isGood)}
                            onClick={remove}
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faThumbUpRegular}
                            className={clsx(styles.goodIcon, styles.isNotGood)}
                            onClick={add}
                        />
                    )}
                </>
            )}

            {(!loggedIn || isMyComment) && <FontAwesomeIcon icon={faThumbUpRegular} className={styles.goodIcon} />}

            <p className={styles.goodCount}>{count.toLocaleString()}</p>
        </div>
    );
};
