import Link from 'next/link';
import styles from './itemListRow.module.css';
import { Items } from '@/types/itemListTypes';
import Image from 'next/image';

type Props = {
    itemList: Items[];
};

export const ItemListRow = ({ itemList }: Props) => {
    return (
        <section className={styles.itemListWrapper}>
            {itemList.map((item) => {
                if (!itemList) return;

                return (
                    <section className={styles.itemListSection} key={item.id}>
                        <Link href={`/item/${item.id}`}>
                            <div className={styles.imageDiv}>
                                <Image
                                    src={item.first_image_url || '/no-image(1x1).png'}
                                    alt={item.name}
                                    width={100}
                                    height={100}
                                    className={styles.itemImage}
                                />
                                {item.status === 'soldout' && (
                                    <div className={styles.sold}>
                                        <p className={styles.soldP}>SOLD</p>
                                    </div>
                                )}
                                {item.Sale?.sale_flag && (
                                    <div className={styles.sale}>
                                        {item.Sale?.discount_rate > 0 && (
                                            <p className={styles.saleP}>{item.Sale?.discount_rate}% OFF</p>
                                        )}
                                        {item.Sale?.discount_amount > 0 && (
                                            <p className={styles.saleP}>
                                                {item.Sale?.discount_amount.toLocaleString()}円引き
                                            </p>
                                        )}
                                    </div>
                                )}
                                <div className={styles.price}>￥{item.price.toLocaleString()}</div>
                            </div>
                            <p className={styles.itemName}>{item.name}</p>
                        </Link>
                    </section>
                );
            })}
        </section>
    );
};
