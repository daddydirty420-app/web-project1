import styles from "./item.module.css";
import { Item } from "../itemPageTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";

type Props = {
    item: Item;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
};

export const ItemName = ({ item, page }: Props) => {
    return (
        <div id="itemName" className={styles.itemNameDiv}>
            <h1 className={styles.itemName}>{item.name}</h1>
            {item.recommend && ["normal", "admin"].includes(page) && <FontAwesomeIcon icon={faFire} className={styles.recommendFire} />}
        </div>
    );
};