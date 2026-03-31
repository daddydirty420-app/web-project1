import styles from './profile.module.css';
import Link from 'next/link';

type Props = {
    shopId: string;
};

export const ShopButton = ({ shopId }: Props) => {
    return (
        <>
        <Link href={`/shop-info/${shopId}`} className={styles.shopButton}>ショップ情報</Link>
        </>
    )
}