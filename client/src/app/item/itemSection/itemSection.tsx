import { Item } from "../itemPageTypes";
import { BuySection } from "./buySection/buySection";
import { CategoryText } from "./categoryText";
import { DeliverySection } from "./deliverySection";
import { Detail } from "./detail";
import styles from "./item.module.css";
import { ItemHeader } from "./itemHeader";
import { Slideshow } from "./slideshow";
import { VariantsList } from "./variantsList";

type Props = {
    id: string;
    item: Item;
    sellerMe?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
    loggedIn: boolean;
};

export const ItemSection = ({ id, item, sellerMe, page, loggedIn }: Props) => {
    const status = item.status;
    const variants = item.attributes.colorVariants;

    return (
        <section className={styles.itemSection}>
            <Slideshow images={item.image_url} />
            <ItemHeader item={item} page={page} />
            {!sellerMe && page === "normal" && !(status === "soldout") && <BuySection id={id} loggedIn={loggedIn} />}
            {variants && variants.length > 0 && <VariantsList item={item} />}
            <Detail id={id} item={item} sellerMe={sellerMe} page={page} />
            <CategoryText item={item} />
            {!(status === "soldout") && <DeliverySection item={item} />}
        </section>
    );
};
