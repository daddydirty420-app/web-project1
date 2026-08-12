"use client";

import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../../../lib/api/apiError";
import { fetchBuy } from "../../api/buy";
import { fetchAddCart, fetchGetCartStatus, fetchRemoveCart } from "../../api/cart";
import styles from "./buy.module.css";

type Props = {
    id: string;
    loggedIn: boolean;
};

export const BuySection = ({ id, loggedIn }: Props) => {
    const [cartIn, setCartIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (loggedIn) {
            const fetchData = async () => {
                try {
                    const data = await fetchGetCartStatus(id);

                    setCartIn(data.status);
                } catch {}
            };

            fetchData();
        }
    }, [id, loggedIn]);

    const add = async () => {
        setCartIn(true);

        try {
            await fetchAddCart(id);

            toast.success("カートに追加しました");
        } catch (err) {
            setCartIn(false);

            if (err instanceof ApiError) return;

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const remove = async () => {
        setCartIn(false);

        try {
            await fetchRemoveCart(id);

            toast.success("カートから削除しました");
        } catch (err) {
            setCartIn(true);

            if (err instanceof ApiError) return;

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const buy = async () => {
        if (!loggedIn) {
            return router.push("/login");
        }

        try {
            const data = await fetchBuy(id);

            // 配送ページとカラー選択ページをできれば1つにまとめる
            router.push(`/buy/trans/${String(data.purchaseSessionId)}`);
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.code === "INVALID_ITEM") {
                    toast.error("この商品は販売中ではないため購入できません");
                } else {
                    toast.error("サーバーエラーが発生しました。時間を置いて、再度クリックをお試しください");
                }

                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    return (
        <>
            <div className={styles.buy}>
                <button type="button" className={styles.buyButton} onClick={buy}>
                    購入手続きへ
                </button>

                {!loggedIn && (
                    <Link href="/login" className={styles.cartDiv}>
                        <FontAwesomeIcon icon={faCartShopping} className={styles.cartIcon} />
                        <p className={styles.cartText}>カートに入れる</p>
                    </Link>
                )}
                {loggedIn && (
                    <div className={styles.cartDiv} onClick={cartIn ? remove : add}>
                        <FontAwesomeIcon icon={faCartShopping} className={styles.cartIcon} />
                        <p className={styles.cartText}>{cartIn ? "カートから削除" : "カートに入れる"}</p>
                    </div>
                )}
            </div>

            <div className={styles.buyFloat}>
                <button type="button" className={styles.floatButton} onClick={buy}>
                    購入手続きへ
                </button>

                {!loggedIn && (
                    <Link href="/login" className={styles.floatCartDiv}>
                        <FontAwesomeIcon icon={faCartShopping} className={styles.floatCartIcon} />
                        <p className={styles.floatCartText}>カートに入れる</p>
                    </Link>
                )}
                {loggedIn && (
                    <div className={styles.floatCartDiv} onClick={cartIn ? remove : add}>
                        <FontAwesomeIcon icon={faCartShopping} className={styles.floatCartIcon} />
                        <p className={styles.floatCartText}>{cartIn ? "カートから削除" : "カートに入れる"}</p>
                    </div>
                )}
            </div>
        </>
    );
};
