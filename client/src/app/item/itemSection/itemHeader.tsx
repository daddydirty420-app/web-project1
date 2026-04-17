import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item } from "../itemPageTypes";
import styles from "./item.module.css";
import { faFire } from "@fortawesome/free-solid-svg-icons";

type Props = {
    item: Item;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
};

export const ItemHeader = ({ item, page }: Props) => {
    return (
        <div className={styles.itemHeader}>
            <div id="itemName" className={styles.itemNameDiv}>
                <h1 className={styles.itemName}>{item.name}</h1>
                {item.recommend && ["normal", "admin"].includes(page) && (
                    <FontAwesomeIcon icon={faFire} className={styles.recommendFire} />
                )}
            </div>

            <div className={styles.priceBlock}>
                {item.status === "soldout" ? (
                    <p className={styles.soldOutInline}>SOLD OUT</p>
                ) : (
                    <>
                        <div className={styles.priceRow}>
                            <h2 className={styles.price}>￥{item.price.toLocaleString()}</h2>

                            {item.Sale?.sale_flag && (
                                <div className={styles.saleBadges}>
                                    {item.Sale?.discount_rate > 0 && (
                                        <span className={styles.saleBadge}>{item.Sale.discount_rate}% OFF</span>
                                    )}
                                    {item.Sale.discount_amount > 0 && (
                                        <span className={styles.saleBadge}>
                                            {item.Sale.discount_amount.toLocaleString()}円引き
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {item.Sale?.sale_flag && (
                            <small className={styles.beforePrice}>￥{item.Sale.before_price.toLocaleString()}</small>
                        )}
                    </>
                )}
            </div>

            {(["men", "women", "unisex"].includes(item.gender_type) || item.age_type === "kids") && (
                <div className={styles.typeTagsRow}>
                    {item.gender_type === "men" && <span className={styles.typeTag}>メンズ</span>}
                    {item.gender_type === "women" && <span className={styles.typeTag}>レディース</span>}
                    {item.gender_type === "unisex" && <span className={styles.typeTag}>ユニセックス</span>}
                    {item.age_type === "kids" && <span className={`${styles.typeTag} ${styles.kidsTag}`}>キッズ</span>}
                </div>
            )}
        </div>
    );
};
