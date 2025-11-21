import styles from "./itemCommon.module.css";
import { Item } from "./itemPageTypes";
import VideoSection from "./videoSection/videoSection";
import ItemSection from "./itemSection/itemSection";
import SellerSectionTop from "./sellerSection/sellerSectionTop";
import { Session } from "next-auth";

type Props = {
    id: string;
    item: Item;
    sellerMe?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
    session: Session | null;
    accessToken: string | null;
    goodCount?: number;
    isGood?: boolean;
    reportCount?: number;
};

export default function Main({ id, item, sellerMe, page, session, accessToken, goodCount, isGood, reportCount }: Props) {
    return (
        <main className={styles.main2column}>
            <div className={styles.left2column}>
                {sellerMe && page === "normal" && <SellerSectionTop id={id} item={item} accessToken={accessToken || ""} />}
                <VideoSection id={id} item={item} sellerMe={sellerMe} session={session} accessToken={accessToken} goodCount={goodCount} isGood={isGood} page={page} reportCount={reportCount} />
            </div>
            <ItemSection id={id} item={item} sellerMe={sellerMe} page={page} session={session} accessToken={accessToken} />
        </main>
    );
};