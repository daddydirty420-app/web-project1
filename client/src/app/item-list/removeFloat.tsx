"use client"

import { KeyedMutator } from "swr";
import styles from "./itemList.module.css";
import { Item } from "./type";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrash } from "@fortawesome/free-solid-svg-icons";

type Props = {
    item: Item;
    page: "cart" | "deleted" | "draft" | "good" | "purchased" | "sold" | "stock" | "uploaded" | "watch-history";
    mutate: KeyedMutator<Responce>;
};

type Responce = {
    itemList: Item[];
};

export const RemoveFloat = ({ item, page, mutate }: Props) => {
    const [floatVisible, setFloatVisible] = useState(false);

    const remove = async (itemId: string) => {
        const getRemoveBasePath = () => {
            if (page === "draft") return `item/draft/delete/${itemId}`;

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
    };

    let removeText = "";

    if (page === "draft") {
        removeText = "下書きから削除";
    } else if (page === "cart") {
        removeText = "カートから削除";
    } else if (page === "good") {
        removeText = "いいねした商品から削除";
    } else if (page === "watch-history") {
        removeText = "閲覧履歴から削除";
    }

    return (
        <>
        <FontAwesomeIcon
        icon={faEllipsis}
        className={styles.ellipsisIcon}
        onClick={() => setFloatVisible(!floatVisible)}
        />

        {floatVisible && (
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
        )}
        </>
    );
}