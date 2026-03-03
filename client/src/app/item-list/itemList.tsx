"use client"

import styles from "./itemList.module.css";
import { Item } from "./type";

type Props = {
    itemList: Item[];
    page: "cart" | "deleted" | "draft" | "good" | "purchased" | "sold" | "stock" | "uploaded";
};

export const ItemList = ({ itemList, page }: Props) => {};