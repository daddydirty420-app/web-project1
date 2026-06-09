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
};

export const FilterMenu = ({ isDesktop }: Props) => {
    const [isDisplay, setIsDisplay] = useState(false);

    return (
        <>
            <FontAwesomeIcon icon={faBars} className={styles.icon} onClick={() => setIsDisplay(!isDisplay)} />

            {isDesktop && isDisplay && (
                <Popover onClose={() => setIsDisplay(false)}>
                    <FilterContent />
                </Popover>
            )}

            {!isDesktop && isDisplay && (
                <BottomSheet onClose={() => setIsDisplay(false)}>
                    <FilterContent />
                </BottomSheet>
            )}
        </>
    );
};
