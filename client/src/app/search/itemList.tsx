"use client";

import styles from "@/styles/components-style/itemList.module.css";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../../lib/fetcher";
import { formatDuration } from "../../lib/formatDuration";
import { getSearchItemListApiKey } from "./apiKey";
import { SearchResponse } from "./type";

export const SearchItemList = async () => {
    const [viewMode, setViewMode] = useState<"item" | "video">("item");
    const [limitVL, setLimitVL] = useState(15);
    const [limitIL, setLimitIL] = useState(36);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // SWRInfinite
    const { data, mutate, size, setSize, isValidating } = useSWRInfinite<SearchResponse>(
        getSearchItemListApiKey,
        async (url: string) => {
            return fetcher<SearchResponse>(url);
        },
    );

    const items = data?.flatMap((page) => page.itemList) ?? [];

    // 追加フェッチ
    const loadMore = useCallback(async () => {
        setIsLoadingMore(true);

        await setSize((prev) => prev + 1);

        setIsLoadingMore(false);
    }, [setSize]);

    const isReachingEnd = data && !data[data.length - 1]?.hasMore;

    // 最下部検知
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target) return;

        if (isReachingEnd || isValidating) return;

        const observer = new IntersectionObserver(
            async ([entry]) => {
                if (!entry.isIntersecting) return;

                if (isLoadingMore) return;

                await loadMore();
            },
            {
                threshold: 0.1,
                rootMargin: "200px",
            },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [isLoadingMore, isReachingEnd, isValidating, loadMore]);

    return (
        <>
            {items.length > 0 && (
                <>
                    {viewMode === "item" && (
                        <>
                            <section className={styles.itemListWrapper}>
                                {items.map((item) => {
                                    if (!item) return;
                                    const itemLink = `/item/${item.id}`;

                                    return (
                                        <section className={styles.itemListSection} key={item.id}>
                                            <Link href={itemLink}>
                                                <div className={styles.ILImageDiv}>
                                                    <Image
                                                        src={
                                                            item.first_image_url
                                                                ? encodeURI(item.first_image_url.trim())
                                                                : "/no-image(1x1).png"
                                                        }
                                                        alt={item.name}
                                                        fill
                                                        sizes="(max-width: 768px) 33vw, 16.66vw"
                                                        priority={false}
                                                        className={styles.itemImage}
                                                    />
                                                    {item.status === "soldout" && (
                                                        <div className={styles.ILSold}>
                                                            <p className={styles.ILSoldP}>SOLD</p>
                                                        </div>
                                                    )}
                                                    {item.Sale?.sale_flag && (
                                                        <div className={styles.ILSaleDiv}>
                                                            {item.Sale?.discount_rate > 0 && (
                                                                <p className={styles.ILSaleText}>
                                                                    {item.Sale.discount_rate}% OFF
                                                                </p>
                                                            )}
                                                            {item.Sale?.discount_amount > 0 && (
                                                                <p className={styles.ILSaleText}>
                                                                    {item.Sale.discount_amount.toLocaleString()}円引き
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className={styles.ILPrice}>
                                                        ￥{item.price.toLocaleString()}
                                                    </div>
                                                </div>

                                                <p className={clsx(styles.ILItemName, styles.line2)}>{item.name}</p>
                                            </Link>
                                        </section>
                                    );
                                })}
                            </section>
                        </>
                    )}

                    {viewMode === "video" && (
                        <>
                            <section className={styles.videoListWrapper}>
                                {items.map((item) => {
                                    if (!item) return;
                                    const itemLink = `/item/${item.id}`;

                                    return (
                                        <section className={styles.videoListSection} key={item.id}>
                                            <Link href={itemLink} className={styles.thumbnail}>
                                                <Image
                                                    src={
                                                        item.Video?.thumbnail_url
                                                            ? encodeURI(item.Video.thumbnail_url.trim())
                                                            : "/no-image(16x9).png"
                                                    }
                                                    alt={item.Video?.title ?? "動画サムネイル"}
                                                    fill
                                                    priority={false}
                                                />
                                                <div className={styles.duration}>
                                                    {formatDuration(item.Video?.duration)}
                                                </div>
                                            </Link>

                                            <div className={styles.itemData}>
                                                <Link href={itemLink} className={styles.videoUser}>
                                                    <h4 className={styles.title}>{item.Video?.title}</h4>
                                                </Link>
                                                <Link href={itemLink} className={styles.itemNamePrice}>
                                                    <p className={styles.syohin}>商品</p>
                                                    <div className={styles.itemNameDiv}>
                                                        <h2 className={styles.itemName}>{item.name}</h2>
                                                    </div>
                                                    <div className={styles.itemPriceSale}>
                                                        {item.Sale?.sale_flag && (
                                                            <p className={styles.beforePrice}>
                                                                ￥{item.Sale.before_price.toLocaleString()}
                                                            </p>
                                                        )}
                                                        {item.status === "soldout" && (
                                                            <p className={styles.saleSold}>SOLD OUT</p>
                                                        )}
                                                        <h3
                                                            className={clsx(
                                                                styles.price,
                                                                item.Sale?.sale_flag ? styles.sale : "",
                                                            )}
                                                        >
                                                            ￥{item.price.toLocaleString()}
                                                        </h3>
                                                    </div>
                                                </Link>
                                            </div>
                                        </section>
                                    );
                                })}
                            </section>
                        </>
                    )}
                </>
            )}

            <div ref={loadMoreRef} />
        </>
    );
};
