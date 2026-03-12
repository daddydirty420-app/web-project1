"use client"

import { useState } from "react";
import styles from "./transaction.module.css";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

type Props = {
    page: "purchased" | "sold";
    tab: "all" | "wait" | "shipping" | "complete";
};

type Responce = {
    totalPages: number;
};

export const OrderList = ({ page, tab }: Props) => {
    const [pageNumber, setPageNumber] = useState(1);

    // apiフェッチ
    const getBasePath = () => {
        
        return null;
    };

    const basePath = getBasePath();

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${basePath}`;

    const { data, mutate } = useSWR<Responce>(apiUrl, fetcher);
};