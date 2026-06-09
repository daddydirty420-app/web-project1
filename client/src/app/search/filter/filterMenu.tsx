"use client";

import { BottomSheet } from "./bottomSheet";
import { FilterContent } from "./filterContent";
import { Popover } from "./popover";

type Props = {
    isDesktop: boolean;
};

export const FilterMenu = ({ isDesktop }: Props) => {
    return (
        <>
            {isDesktop && (
                <Popover>
                    <FilterContent />
                </Popover>
            )}

            {!isDesktop && (
                <BottomSheet>
                    <FilterContent />
                </BottomSheet>
            )}
        </>
    );
};
