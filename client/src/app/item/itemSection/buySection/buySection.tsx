"use client";

import { getAccessToken } from "@/lib/getAccessToken";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../../../lib/api/apiError";
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
                } catch (err) {}
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
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                const deliveryId = data.deliveryId;

                // 配送ページとカラー選択ページをできれば1つにまとめる
                router.push(`/buy/trans/${deliveryId}`);
            } else if (data.message) {
                toast.error(data.message);
            }
        } catch (err) {
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
