import { UrlText } from "./urlText";
import { Item } from "../itemPageTypes";
import { SaleButton } from "./saleButton";
import { UploadButton } from "./uploadButton";
import styles from "./seller.module.css";

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
