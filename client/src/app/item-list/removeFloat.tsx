"use client"

import { KeyedMutator } from "swr";
import styles from "./removeFloat.module.css";
import { Item } from "./type";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { refreshToken } from "@/lib/refreshToken";
import toast from "react-hot-toast";

type Responce = {
    itemList: Item[];
    totalPages: number;
};

type Props = {
    item: Item;
    page: "cart" | "deleted" | "draft" | "like" | "purchased" | "sold" | "stock" | "uploaded" | "watch-history";
    mutate: KeyedMutator<Responce>;
};

export const RemoveFloat = ({ item, page, mutate }: Props) => {
    const [floatVisible, setFloatVisible] = useState(false);

    const remove = async (itemId: string) => {
        const getRemoveBasePath = () => {
            if (page === "draft") return `items/${itemId}/draft`;
            if (page === "like") return `item-like/${itemId}`;
            if (page === "watch-history") return `watch-history/${itemId}`;

            return null;
        };

        const removeBasePath = getRemoveBasePath();

        const apiUrl = removeBasePath
        ? `${process.env.NEXT_PUBLIC_API_URL}/${removeBasePath}`
        : null;

        if (!apiUrl?.trim()) {
            console.error("削除URLが見つかりません");
            return;
        }

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

        let toastBaseText = ""; 

        if (page === "draft") {
            toastBaseText = "下書き商品";
        } else if (page === "like") {
            toastBaseText = "いいねした商品";
        } else if (page === "watch-history") {
            toastBaseText = "閲覧履歴";
        }

        try {
            const accessToken = await refreshToken();
                
            if (!accessToken) {
                throw new Error("AUTH_ERROR");
            }

            const res = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) {
                throw new Error("DELETE_ERROR");
            }

            mutate();

            toast.success(`${toastBaseText}を削除しました`);
        } catch (err) {
            mutate(); // ロールバック
            console.error(err);

            if (err instanceof Error) {
                if (err.message === "AUTH_ERROR") {
                    alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                } else if (err.message === "DELETE_ERROR") {
                    toast.error(`${toastBaseText}の削除に失敗しました`);
                } else {
                    alert("システムエラーが発生しました。時間をおいて再試行してください。");
                }
            }
        }
    };

    let removeText = "";

    if (page === "draft") {
        removeText = "下書きから削除";
    } else if (page === "like") {
        removeText = "いいねした商品から削除";
    } else if (page === "watch-history") {
        removeText = "閲覧履歴から削除";
    }

    return (
        <>
        <FontAwesomeIcon
        icon={faEllipsisVertical}
        className={styles.ellipsisIcon}
        onClick={() => setFloatVisible(!floatVisible)}
        />

        {floatVisible && (
            <>
            <div className={styles.overlay} onClick={() => setFloatVisible(false)} />

            <div className={styles.float}>
                <div
                className={styles.removeFlex}
                onClick={() => remove(item.id)}
                >
                    <FontAwesomeIcon
                    icon={faTrash}
                    className={styles.trashIcon}
                    />

                    <p className={styles.floatText}>{removeText}</p>
                </div>
            </div>
            </>
        )}
        </>
    );
}