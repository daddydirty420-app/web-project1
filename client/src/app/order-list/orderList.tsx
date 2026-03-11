"use client"

import { useState } from "react";
import styles from "./transaction.module.css";

type Props = {
    page: "purchased" | "sold";
    tab: "all" | "wait" | "shipping" | "complete";
};

export const OrderList = ({ page, tab }: Props) => {
    const [pageNumber, setPageNumber] = useState(1);

    // apiフェッチ
    const getBasePath = () => {
        
        return null;
    };

    const basePath = getBasePath();
};