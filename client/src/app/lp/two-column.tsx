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
import { Session } from "next-auth";

type Res = {
    items: Items[];
    totalPages: number;
};

type Props = {
    shopPage?: boolean;
    hasShop?: boolean;
    itemList: Res;
    session: Session | null;
};

export default function TwoColumn({ shopPage, hasShop, itemList, session }: Props) {
    return (
        <section className={styles.twoColumnContainer}>
            <aside className={styles.sidebar}>
                <LpItemList defaultVideoList={itemList} session={session} />
            </aside>
            <main className={styles.main}>
                <MainAbout shopPage={shopPage} />
                <MainUploadFlow session={session} />
                {shopPage && <MainShopFlow />}
                <MainQA />
                {shopPage && <InquiryButton />}
                <Button shopPage={shopPage} hasShop={hasShop} session={session} />
                {!shopPage && <MainAllUser />}
                {shopPage && <MainShopUtil />}
                <MainCampaign />
            </main>
        </section>
    );
};