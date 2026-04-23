import { Items } from "@/types/itemListTypes";
import { Button } from "./button/button";
import { InquiryButton } from "./button/inquiryButton";
import { LpItemList } from "./itemList/lpItemList";
import styles from "./lp.module.css";
import { MainAbout } from "./main/mainAbout";
import { MainAllUser } from "./main/mainAllUser";
import { MainCampaign } from "./main/mainCampaign";
import { MainQA } from "./main/mainQA";
import { MainShopFlow } from "./main/mainShopFlow";
import { MainShopUtil } from "./main/mainShopUtil";
import { MainUploadFlow } from "./main/mainUploadFlow";

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

export const TwoColumn = ({ shopPage, hasShop, itemList, loggedIn }: Props) => {
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
