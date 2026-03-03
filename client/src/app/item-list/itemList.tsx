"use client"

import { useState } from "react";
import styles from "./itemList.module.css";
import { Item } from "./type";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { RemoveFloat } from "./removeFloat";

type Props = {
    page: "cart" | "deleted" | "draft" | "good" | "purchased" | "sold" | "stock" | "uploaded" | "watch-history";
};

type Responce = {
    itemList: Item[];
};

export const ItemList = ({ page }: Props) => {
    const [searchValue, setSearchValue] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const getBasePath = () => {
        if (page === "draft") return "item-list/draft";

        return null;
    };

    const basePath = getBasePath();

    const apiUrl = basePath
    ? `${process.env.NEXT_PUBLIC_API_URL}/${basePath}${
        searchKeyword.trim()
        ? `/search?keyword=${encodeURIComponent(searchKeyword.trim())}`
        : ""
    }`
    : null;

    const { data, mutate } = useSWR<Responce>(apiUrl, fetcher);

    const itemList = data?.itemList;
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchValue(val);
    };

    return (
        <>
        <section className={styles.searchSection}>
            <input
            type="text"
            name="itemList_search"
            placeholder="検索"
            className={styles.searchInput}
            value={searchValue}
            onChange={onChange}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setSearchKeyword(searchValue);
                }
            }}
            autoComplete="off"
            />
            <FontAwesomeIcon
            icon={faSearch}
            name="search_icon"
            className={`
                ${styles.searchIcon} 
                ${searchValue.trim() ? styles.activeIcon : ""}
            `}
            onClick={() => {
                setSearchKeyword(searchValue);
            }}
            />
        </section>

        {itemList && itemList.length > 0 && (
            <main className={styles.itemListSection}>
                {itemList.map((item) => {
                    let itemPageLink = "";

                    if (["cart", "good", "stock", "uploaded", "watch-history"].includes(page)) {
                        itemPageLink = `/item/${item.id}`;
                    } else if (page === "draft") {
                        itemPageLink = `/item/draft/${item.id}`;
                    } else if (page === "deleted") {
                        itemPageLink = `/item/deleted/${item.id}`;
                    }

                    let previewDateLabel = "";

                    if (page === "draft") {
                        previewDateLabel = "保存日時";
                    } else if (page === "deleted") {
                        previewDateLabel = "削除日時";
                    }

                    let previewDate = "";

                    if (["deleted", "draft"].includes(page)) {
                        previewDate = formatRelativeTime(item.save_at);
                    }

                    return (
                        <section key={item.id} className={styles.itemSection}>
                            <Link
                            href={itemPageLink}
                            className={styles.itemLinkArea}
                            >
                                <div className={styles.itemImageText}>
                                    <Image
                                    src={item.first_image_url ?? "/no-image(1x1).png"}
                                    alt="商品画像"
                                    width={120}
                                    height={120}
                                    className={styles.image}
                                    />

                                    <div className={styles.itemTextArea}>
                                        <h2 className={styles.itemName}>{item.name ?? ""}</h2>

                                        {["deleted", "draft"].includes(page) && (
                                            <p className={styles.date}>{previewDateLabel}: {previewDate}</p>
                                        )}

                                        <h4 className={styles.videoTitle}>動画： 
                                            <span className={styles.weight500}>{item.Video?.title ?? ""}</span>
                                        </h4>
                                    </div>
                                </div>

                                <h3 className={styles.price}>￥{item.price.toLocaleString()}</h3>
                            </Link>

                            {["cart", "draft", "good", "watch-history"].includes(page) && (
                                <RemoveFloat item={item} page={page} mutate={mutate} />
                            )}
                        </section>
                    );
                })}
            </main>
        )}

        {itemList?.length === 0 && (
            <>
            <p className={styles.noItem}>商品が見つかりません</p>
            </>
        )}
        </>
    );
};