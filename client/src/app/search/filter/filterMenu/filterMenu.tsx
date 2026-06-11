"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { BottomSheet } from "../bottomSheet/bottomSheet";
import { FilterContent } from "../filterContent/filterContent";
import { Popover } from "../popover/popover";
import styles from "./styles.module.css";

type Props = {
    isDesktop: boolean;
    sort: "popular" | "new" | "priceAsc" | "priceDesc";
};

export const FilterMenu = ({ isDesktop, sort }: Props) => {
    const [isDisplay, setIsDisplay] = useState(false);

    return (
        <>
            <FontAwesomeIcon icon={faBars} className={styles.icon} onClick={() => setIsDisplay(!isDisplay)} />

            {isDesktop && isDisplay && (
                <Popover onClose={() => setIsDisplay(false)} isOpen={isDisplay}>
                    <FilterContent onClose={() => setIsDisplay(false)} sort={sort} />
                </Popover>
            )}

            {!isDesktop && isDisplay && (
                <BottomSheet onClose={() => setIsDisplay(false)}>
                    <FilterContent onClose={() => setIsDisplay(false)} sort={sort} />
                </BottomSheet>
            )}
        </>
    );
};
