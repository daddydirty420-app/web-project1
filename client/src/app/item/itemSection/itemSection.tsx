import { Item } from "../itemPageTypes";
import styles from "./item.module.css";
import Slideshow from "./slideshow";
import Explain from "./explain";
import CategoryText from "./categoryText";
import VariantsList from "./variantsList";
import DeliverySection from "./deliverySection";
import BuySection from "./buySection/buySection";
import ItemHeader from "./itemHeader";

type Props = {
    id: string;
    item: Item;
    sellerMe?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
    loggedIn: boolean;
};

export default function ItemSection({ id, item, sellerMe, page, loggedIn }: Props) {
    const status = item.status;
    const variants = item.attributes.variants;

    return (
        <section className={styles.itemSection}>
            <Slideshow images={item.image_url} />
            <ItemHeader item={item} page={page} />
            {status === "soldout" && <p className={styles.soldOut}>SOLD OUT</p>}
            {!sellerMe && page === "normal" && !(status === "soldout") && <BuySection id={id} item={item} loggedIn={loggedIn} />}
            {variants && variants.length > 0 && <VariantsList item={item} />}
            <Explain id={id} item={item} sellerMe={sellerMe} page={page} />
            <CategoryText item={item} />
            {!(status === "soldout") && <DeliverySection item={item} />}
        </section>
    );
};