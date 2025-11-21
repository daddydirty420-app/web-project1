"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./video.module.css";
import { useGoodStatus, useGoodCount, updateGoodItemCache } from "@/hooks/useGoodItem";
import { faThumbsUp as faThumbsUpSolid } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as faThumbUpRegular } from "@fortawesome/free-regular-svg-icons";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/refreshToken";
import { Session } from "next-auth";

type Props = {
    id: string;
    sellerMe?: boolean;
    session: Session | null;
    initialGood?: boolean;
    initialCount?: number;
    page: "normal" | "admin";
};

export default function Good({ id, sellerMe, session, initialGood, initialCount, page }: Props) {
    const { data: goodStatus } = useGoodStatus(id);
    const { data: goodCount } = useGoodCount(id);
    const router = useRouter();

    const good = goodStatus?.isGood ?? initialGood ?? false;
    const count = goodCount?.count ?? initialCount ?? 0;

    const loggedIn = session?.user;

    const add = async () => {
        const accessToken = await refreshToken();

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/good-item/add/${id}`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${accessToken ?? ""}`,
            },
        });
        updateGoodItemCache(id, true);
    };

    const remove = async () => {
        const accessToken = await refreshToken();

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/good-item/remove/${id}`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${accessToken ?? ""}`,
            },
        });
        updateGoodItemCache(id, false);
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
            <p className={styles.countText}>高評価数</p>
        </div>
        </>
    );
};