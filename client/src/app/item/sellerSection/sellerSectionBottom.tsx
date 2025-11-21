import styles from "./seller.module.css";
import SaleButton from "./saleButton";
import UploadButton from "./uploadButton";
import DeleteItem from "./deleteItem";
import { Item } from "../itemPageTypes";

type Props = {
    id: string;
    item: Item;
    accessToken: string;
};

export default function SellerSectionBottom({ id, item, accessToken }: Props) {
    return (
        <nav className={styles.sellerSectionBottom}>
            <UploadButton id={id} accessToken={accessToken} />
            <SaleButton item={item} accessToken={accessToken} />
            <DeleteItem id={id} accessToken={accessToken} />
        </nav>
    );
};