"use client"

import { KeyedMutator } from "swr";
import styles from "./cart.module.css";
import { Item } from "./type";
import { refreshToken } from "@/lib/refreshToken";
import toast from "react-hot-toast";

type Responce = {
    itemList: Item[];
    totalPages: number;
};

type Props = {
    item: Item;
    mutate: KeyedMutator<Responce>;
};

export const CartElement = ({ item, mutate }: Props) => {

    const buy = async () => {
    };

    const remove = async (itemId: string) => {
        // 楽観的更新
        mutate((currentData) => {
            if (!currentData) return currentData;

            return {
                ...currentData,
                itemList: currentData.itemList.filter(
                    (item) => item.id !== itemId
                ),
            };
        }, false);

        try {
            const accessToken = await refreshToken();
                        
            if (!accessToken) {
                throw new Error("AUTH_ERROR");
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove/:id`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) {
                throw new Error("DELETE_ERROR");
            }

            mutate();

            toast.success("カートから削除しました");
        } catch (err) {
            mutate(); // ロールバック
            console.error(err);

            if (err instanceof Error) {
                if (err.message === "AUTH_ERROR") {
                    alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                } else if (err.message === "DELETE_ERROR") {
                    toast.error("カート削除に失敗しました");
                } else {
                    alert("システムエラーが発生しました。時間をおいて再試行してください。");
                }
            }
        }
    };

    return (
        <section className={styles.cartSection}>
            <button
            type="button"
            name="cart-remove"
            className={styles.remove}
            onClick={() => remove(item.id)}
            >
                カートから削除
            </button>

            <button
            type="button"
            name="buy"
            className={styles.buy}
            onClick={buy}
            >
                購入手続きへ
            </button>
        </section>
    );
};