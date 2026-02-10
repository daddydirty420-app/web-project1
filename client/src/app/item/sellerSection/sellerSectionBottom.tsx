import styles from "./seller.module.css";
import { SaleButton } from "./saleButton";
import { UploadButton } from "./uploadButton";
import { DeleteItem } from "./deleteItem";
import { Item } from "../itemPageTypes";

type Props = {
    id: string;
    item: Item;
};

export const SellerSectionBottom = ({ id, item }: Props) => {
    return (
        <nav className={styles.sellerSectionBottom}>
            <UploadButton id={id} />
            <SaleButton item={item} />
            <DeleteItem id={id} />
        </nav>
    );
};