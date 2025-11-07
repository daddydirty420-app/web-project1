import ItemList from './itemList';
import styles from './profile.module.css';
import { DefaultVideoList } from './profileTypes';

type Props = {
    userId: string;
    defaultVideoList: DefaultVideoList;
    adminPage?: boolean;
};

export default async function ItemSection({ userId, defaultVideoList, adminPage }: Props) {
    return (
        <div className='mt-4'>
            <p className={styles.itemTitle}>出品した商品</p>
            <ItemList userId={userId} defaultVideoList={defaultVideoList} adminPage={adminPage} />
        </div>
    );
};