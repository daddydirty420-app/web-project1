import styles from "./seller.module.css";
import { SaleButton } from "./saleButton";
import { UploadButton } from "./uploadButton";
import { DeleteItem } from "./deleteItem";
import { Item } from "../itemPageTypes";

type Props = {
    id: string;
    item: Item;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
};

export const SellerSectionBottom = ({ id, item, page }: Props) => {
    return (
        <nav className={styles.sellerSectionBottom}>
            <UploadButton id={id} />
            <SaleButton item={item} />
            <DeleteItem id={id} page={page} />
        </nav>
    );
};