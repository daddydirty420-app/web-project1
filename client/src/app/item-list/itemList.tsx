"use client"

import { useState } from "react";
import styles from "./itemList.module.css";
import { Item } from "./type";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { RemoveFloat } from "./removeFloat";
import clsx from "clsx";

type Props = {
    page: "cart" | "deleted" | "draft" | "good" | "purchased" | "sold" | "stock" | "uploaded" | "watch-history";
};

type Responce = {
    itemList: Item[];
    totalPages: number;
};

export const ItemList = ({ page }: Props) => {
    const [searchValue, setSearchValue] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);

    // apiフェッチ
    const getBasePath = () => {
        if (page === "draft") return "item-list/draft-list";
        if (page === "deleted") return "item-list/deleted-list";
        if (page === "good") return "item-list/good-list";

        return null;
    };

    const basePath = getBasePath();

    const apiUrl = basePath
    ? `${process.env.NEXT_PUBLIC_API_URL}/${basePath}${
        searchKeyword.trim()
        ? `/search?keyword=${encodeURIComponent(searchKeyword.trim())}&page=${pageNumber}`
        : `?page=${pageNumber}`
    }`
    : null;

    const { data, mutate } = useSWR<Responce>(apiUrl, fetcher);

    const itemList = data?.itemList;
    const totalPages = data?.totalPages ?? 1;

    console.log(itemList);
    console.log(totalPages);
    
    // 検索
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        setPageNumber(1);
        setSearchValue(val);

        if (val.trim() === "") {
            setSearchKeyword("");
        }
    };

    // ページネーション
    const renderPagenation = (
        currentPage: number,
        totalPages: number,
        onPageChange: (page: number) => void
    ) => {
        if (totalPages <= 1) return null;

        const pages: (number | string)[] = [];
        const delta = typeof window !== "undefined" && window.innerWidth >= 768 ? 2 : 1;

        pages.push(1);

        if (currentPage - delta > 2) pages.push('...');

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            pages.push(i);
        }

        if (currentPage + delta < totalPages - 1) pages.push('...');

        if (totalPages > 1) pages.push(totalPages);

        return (
            <div className={styles.pagenation}>
                <button
                type='button'
                disabled={currentPage === 1}
                className={styles.pageButtonIcon}
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                title="前へ"
                >
                    <FontAwesomeIcon icon={faAnglesLeft} className={styles.pageIcon} />
                </button>

                {pages.map((p, idx) =>
                p === '...' ? (
                    <span key={idx} className={styles.ellipsis}>...</span>
                ) : (
                    <button
                    type='button'
                    key={idx}
                    className={clsx(styles.pageButton, currentPage === p && styles.active)}
                    onClick={() => onPageChange(p as number)}
                    >{p}</button>
                ))}

                <button
                type='button'
                disabled={currentPage === totalPages}
                className={styles.pageButtonIcon}
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                title='次へ'
                >
                    <FontAwesomeIcon icon={faAnglesRight} className={styles.pageIcon} />
                </button>
            </div>
        );
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
                    setPageNumber(1);
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
                setPageNumber(1);
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
                                            <div className={styles.dateDiv}>
                                                <p className={styles.dateText}>{previewDateLabel}:</p>
                                                <p className={styles.dateText}>{previewDate}</p>
                                            </div>
                                        )}

                                        <div className={styles.videoTitleDiv}>
                                            <p className={styles.titleLabel}>動画：</p> 
                                            <h4 className={styles.videoTitle}>{item.Video?.title ?? ""}</h4>
                                        </div>
                                    </div>
                                </div>

                                <h3 className={styles.price}>￥{item.price.toLocaleString()}</h3>
                            </Link>

                            {["draft", "good", "watch-history"].includes(page) && (
                                <RemoveFloat item={item} page={page} mutate={mutate} />
                            )}
                        </section>
                    );
                })}

                {renderPagenation(pageNumber, totalPages, (p) => {
                    setPageNumber(p);
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