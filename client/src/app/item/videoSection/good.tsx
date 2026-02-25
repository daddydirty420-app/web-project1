"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./video.module.css";
import { useGoodStatus, useGoodCount, updateGoodItemCache } from "@/hooks/useGoodItem";
import { faThumbsUp as faThumbsUpSolid } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as faThumbUpRegular } from "@fortawesome/free-regular-svg-icons";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    id: string;
    sellerMe?: boolean;
    initialGood?: boolean;
    initialCount?: number;
    page: "normal" | "admin";
    loggedIn: boolean;
};

export const Good = ({ id, sellerMe, initialGood, initialCount, page, loggedIn }: Props) => {
    const { data: goodStatus } = useGoodStatus(id);
    const { data: goodCount } = useGoodCount(id, initialCount ?? 0);
    const router = useRouter();

    const good = goodStatus?.isGood ?? initialGood ?? false;
    const count = goodCount?.count ?? 0;

    const add = async () => {
        updateGoodItemCache(id, true);

        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/good-item/add/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            updateGoodItemCache(id, false);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const remove = async () => {
        updateGoodItemCache(id, false);

        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/good-item/remove/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            updateGoodItemCache(id, true);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const userList = () => (sellerMe || page === "admin") && router.push(`/user-list/good-item/${id}`);

    return (
        <>
        {loggedIn && !sellerMe && page === "normal" && (
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