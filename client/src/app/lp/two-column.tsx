import styles from "./lp.module.css";
import LpItemList from "./itemList/lpItemList";
import MainAbout from "./main/mainAbout";
import MainUploadFlow from "./main/mainUploadFlow";
import MainShopFlow from "./main/mainShopFlow";
import MainQA from "./main/mainQA";
import InquiryButton from "./button/inquiryButton";
import Button from "./button/button";
import MainAllUser from "./main/mainAllUser";
import MainShopUtil from "./main/mainShopUtil";
import MainCampaign from "./main/mainCampaign";
import { Items } from "@/types/itemListTypes";

type Res = {
    items: Items[];
    totalPages: number;
};

type Props = {
    shopPage?: boolean;
    hasShop?: boolean;
    itemList: Res;
    loggedIn: boolean;
};

export default function TwoColumn({ shopPage, hasShop, itemList, loggedIn }: Props) {
    return (
        <section className={styles.twoColumnContainer}>
            <aside className={styles.sidebar}>
                <LpItemList defaultVideoList={itemList} />
            </aside>
            <main className={styles.main}>
                <MainAbout shopPage={shopPage} />
                <MainUploadFlow loggedIn={loggedIn} />
                {shopPage && <MainShopFlow />}
                <MainQA />
                {shopPage && <InquiryButton />}
                <Button shopPage={shopPage} hasShop={hasShop} loggedIn={loggedIn} />
                {!shopPage && <MainAllUser />}
                {shopPage && <MainShopUtil />}
                <MainCampaign />
            </main>
        </section>
    );
};