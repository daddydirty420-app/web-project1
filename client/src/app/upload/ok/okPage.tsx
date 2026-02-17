"use client"

import { Item } from "../types/type";
import OkUI from "./okUI";

type Props = {
    itemId: string;
    item: Item;
    hasReccomend: boolean;
};

export const OkPage = ({ itemId, item, hasReccomend }: Props) => {
    return (
        <OkUI title="出品が完了しました">
            {hasReccomend}
        </OkUI>
    );
};