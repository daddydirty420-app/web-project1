import styles from "./seller.module.css";
import SaleButton from "./saleButton";
import UploadButton from "./uploadButton";
import DeleteItem from "./deleteItem";
import { Item } from "../itemPageTypes";
import { Session } from "next-auth";

type Props = {
    id: string;
    item: Item;
    session: Session | null;
};

export default function SellerSectionBottom({ id, item, session }: Props) {
    return (
        <nav className={styles.sellerSectionBottom}>
            <UploadButton id={id} session={session} />
            <SaleButton item={item} session={session} />
            <DeleteItem id={id} session={session} />
        </nav>
    );
};