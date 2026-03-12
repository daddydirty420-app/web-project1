"use client"

import { useState } from "react";
import styles from "./transaction.module.css";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { PaidInfo } from "./type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

type Props = {
    page: "purchased" | "sold";
    tab: "all" | "wait" | "shipping" | "complete";
};

type Responce = {
    paidList: PaidInfo[];
    totalPages: number;
};

export const OrderList = ({ page, tab }: Props) => {
    const [pageNumber, setPageNumber] = useState(1);

    // apiフェッチ
    const getBasePath = () => {
        if (page === "purchased") {
            if (tab === "all") return "order-list/purchased/all";
            if (tab === "wait") return "order-list/purchased/wait";
            if (tab === "shipping") return "order-list/purchased/shipping";
            if (tab === "complete") return "order-list/purchased/complete";
        } else if (page === "sold") {
            if (tab === "all") return "order-list/sold/all";
            if (tab === "wait") return "order-list/sold/wait";
            if (tab === "shipping") return "order-list/sold/shipping";
            if (tab === "complete") return "order-list/sold/complete";
        }
        
        return null;
    };

    const basePath = getBasePath();

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${basePath}`;

    const { data } = useSWR<Responce>(apiUrl, fetcher);

    const paidList = data?.paidList;
    const totalPages = data?.totalPages ?? 1;

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
                    className={`${styles.pageButton} ${
                        currentPage === p
                        ? styles.active
                        : ""
                    }`}
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
        {paidList && paidList.length > 0 && (
            <main className={styles.paidListSection}>
                {paidList.map((paid) => {
                    const link = page === "purchased"
                    ? `/order/purchased/${paid.id}`
                    : page === "sold"
                    ? `/order/sold/${paid.id}`
                    : "";

                    return (
                        <section key={paid.id} className={styles.paidSection}>
                            <div className={styles.paidFlex}>
                                <Link
                                href={link}
                                className={styles.paidLinkArea}
                                >
                                    <div className={styles.imageText}>
                                        <div className={styles.imageDiv}>
                                            <Image
                                            src={paid.purchase_snapshot.item_image || "/no-image(1x1).png"}
                                            alt="商品画像"
                                            width={80}
                                            height={80}
                                            className={styles.image}
                                            />
                                        </div>

                                        <div className={styles.itemTextArea}>
                                            <h2 className={`${styles.itemName} ${styles.line1}`}>{paid.purchase_snapshot.item_name || ""}</h2>

                                            <div className={styles.transDiv}>
                                                <p className={styles.transLabel}>配送状況：</p>
                                                <p className={`${styles.transText} ${styles.line1}`}>{paid.Delivery?.DeliveryStatusOption?.name}</p>
                                            </div>

                                            {["cancelled", "returned"].includes(paid.status) && (
                                                <p className={styles.cancel}>{
                                                    paid.status === "returned"
                                                    ? "返品"
                                                    : "キャンセル"
                                                }</p>
                                            )}
                                        </div>

                                        <div className={styles.priceColumn}>
                                            <h3 className={styles.price}>￥{paid.total_amount.toLocaleString()}</h3>

                                            {page === "purchased" && paid.point_used > 0 && (
                                                <div className={styles.pointDiv}>
                                                    <p className={styles.pointLabel}>ポイント利用：</p>
                                                    <p className={styles.point}>{paid.point_used.toLocaleString()}P</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </section>
                    );
                })}

                {renderPagenation(pageNumber, totalPages, (p) => {
                    setPageNumber(p);
                })}
            </main>
        )}

        {paidList?.length === 0 && (
            <p className={styles.noList}>{
                page === "purchased"
                ? "購入した商品がありません"
                : page === "sold"
                ? "売却した商品はありません"
                : ""
            }</p>
        )}
        </>
    );
};