"use client";

import styles from "./buy.module.css";
import { useRouter } from "next/navigation";
import { Item } from "../../itemPageTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    id: string;
    item: Item;
    loggedIn: boolean;
};

export const BuySection = ({ id, item, loggedIn }: Props) => {
    const [cartIn, setCartIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (loggedIn) {
            const fetchData = async () => {
                try {
                    const accessToken = await refreshToken();
                
                    if (!accessToken) {
                        alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                        return;
                    }

                    const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/status/${id}`, {
                        method: 'GET',
                        cache: 'no-store',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    if (statusRes.ok) {
                        const data = await statusRes.json();
                        setCartIn(data.cartIn);
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            fetchData();
        }
    }, [id, loggedIn]);

    const add = async () => {
        setCartIn(true);

        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                toast.success("カートに追加しました。");
            }
        } catch (err) {
            setCartIn(false);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const remove = async () => {
        setCartIn(false);

        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                toast.success("カートから削除しました。");
            }
        } catch (err) {
            setCartIn(true);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const buy = async () => {
        if (!loggedIn) {
            return router.push("/login");
        }

        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/buy/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                const deliveryId = data.deliveryId;
                
                // 配送ページとカラー選択ページをできれば1つにまとめる
                router.push(`/buy/trans/${deliveryId}`);
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <>
        <div className={styles.buy}>
            <button type="button" className={styles.buyButton} onClick={buy}>購入手続きへ</button>

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
            <button type="button" className={styles.floatButton} onClick={buy}>購入手続きへ</button>

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