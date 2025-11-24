import { Item } from "../itemPageTypes";
import styles from "./item.module.css";
import Slideshow from "./slideshow";
import ItemName from "./itemName";
import Price from "./price";
import Explain from "./explain";
import CategoryText from "./categoryText";
import ColorSizeList from "./colorSizeList";
import DeliverySection from "./deliverySection";
import BuySection from "./buySection/buySection";

type Props = {
    id: string;
    item: Item;
    sellerMe?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
    loggedIn: boolean;
};

export default function ItemSection({ id, item, sellerMe, page, loggedIn }: Props) {
    return (
        <section className={styles.itemSection}>
            <Slideshow images={item.image_url} />
            <ItemName item={item} page={page} />
            <Price item={item} />
            {item.sold_out && <p className={styles.soldOut}>SOLD OUT</p>}
            {!sellerMe && page === "normal" && !item.sold_out && <BuySection id={id} item={item} loggedIn={loggedIn} />}
            {item.ColorSizes && item.ColorSizes.length > 0 && <ColorSizeList cs={item.ColorSizes} />}
            <Explain id={id} item={item} sellerMe={sellerMe} page={page} />
            <CategoryText item={item} />
            {!item.sold_out && <DeliverySection item={item} />}
        </section>
    );
};