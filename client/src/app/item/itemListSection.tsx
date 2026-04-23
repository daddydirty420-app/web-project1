import { ItemListRow } from "@/components";
import { Items } from "@/types/itemListTypes";
import styles from "./itemCommon.module.css";

type Props = {
    itemList?: Items[];
    sellerMe?: boolean;
};

export const ItemListSection = ({ itemList, sellerMe }: Props) => {
    if (!itemList) {
        console.error("itemListがありません。", itemList);
        return;
    }

    return (
        <>
            {sellerMe ? (
                <p className={styles.itemListText}>他の商品</p>
            ) : (
                <p className={styles.itemListText}>関連する商品</p>
            )}

            <ItemListRow itemList={itemList} />
        </>
    );
};
