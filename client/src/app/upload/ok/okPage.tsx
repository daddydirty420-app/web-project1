"use client"

import { Item } from "../types/type";
import { ItemHighlight } from "./itemHighlight";
import { OkText } from "./okText";
import OkUI from "./okUI";

type Props = {
    itemId: string;
    item: Item;
    hasRecommend: boolean;
};

export const OkPage = ({ itemId, item, hasRecommend }: Props) => {
    return (
        <OkUI title="出品が完了しました">
            <ItemHighlight itemId={itemId} item={item} />
            <OkText name={item.name ?? ""} />

            {!hasRecommend}
        </OkUI>
    );
};