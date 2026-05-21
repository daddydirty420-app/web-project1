"use client";

import { updateItemLikeCache, useLikeCount, useLikeStatus } from "@/hooks/useItemLike";
import { faThumbsUp as faThumbUpRegular } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as faThumbsUpSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ApiError } from "../../../lib/api/apiError";
import { fetchItemLikeAdd, fetchItemLikeRemove } from "../api/itemLike";
import styles from "./video.module.css";

type Props = {
    id: string;
    sellerMe?: boolean;
    initialLike?: boolean;
    initialCount?: number;
    page: "normal" | "admin";
    loggedIn: boolean;
};

export const Like = ({ id, sellerMe, initialLike, initialCount, page, loggedIn }: Props) => {
    const { data: goodStatus } = useLikeStatus(id);
    const { data: goodCount } = useLikeCount(id);
    const router = useRouter();

    const like = goodStatus?.isGood ?? initialLike ?? false;
    const count = goodCount?.count ?? initialCount ?? 0;

    const add = async () => {
        updateItemLikeCache(id, true);

        try {
            await fetchItemLikeAdd(id);
        } catch (err) {
            updateItemLikeCache(id, false);

            if (err instanceof ApiError) return;

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const remove = async () => {
        updateItemLikeCache(id, false);

        try {
            await fetchItemLikeRemove(id);
        } catch (err) {
            updateItemLikeCache(id, true);

            if (err instanceof ApiError) return;

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const userList = () => (sellerMe || page === "admin") && router.push(`/user-list/item-like/${id}`);

    return (
        <>
            {loggedIn && !sellerMe && page === "normal" && (
                <>
                    {like ? (
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

            {(!loggedIn || sellerMe || page !== "normal") && (
                <FontAwesomeIcon icon={faThumbUpRegular} className={styles.goodIcon} onClick={userList} />
            )}

            <div className="block text-center" onClick={userList}>
                <p className={styles.countNumber}>{count.toLocaleString()}</p>
                <p className={styles.countText}>good</p>
            </div>
        </>
    );
};
