import { Item } from "../itemPageTypes";
import { SaleButton } from "./saleButton";
import styles from "./seller.module.css";
import { UploadButton } from "./uploadButton";
import { UrlText } from "./urlText";

type Props = {
    id: string;
    item: Item;
};

export const SellerSectionTop = ({ id, item }: Props) => {
    return (
        <nav className={styles.sellerSectionTop}>
            <UrlText />
            <SaleButton item={item} />
            <UploadButton id={id} />
        </nav>
    );
};
