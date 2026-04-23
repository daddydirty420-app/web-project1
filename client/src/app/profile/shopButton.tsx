import Link from "next/link";
import styles from "./profile.module.css";

type Props = {
    shopId: string;
};

export const ShopButton = ({ shopId }: Props) => {
    return (
        <>
            <Link href={`/shop-info/${shopId}`} className={styles.shopButton}>
                ショップ情報
            </Link>
        </>
    );
};
