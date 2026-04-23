import { Item } from "../itemPageTypes";
import { DeleteItem } from "./deleteItem";
import { SaleButton } from "./saleButton";
import styles from "./seller.module.css";
import { UploadButton } from "./uploadButton";

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
