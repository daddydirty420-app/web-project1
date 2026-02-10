import { Item } from "../itemPageTypes";
import styles from "./video.module.css";
import { VideoElem } from "./videoElem";
import { CountElem } from "./countElem";
import { Summary } from "./summary";
import { UserSection } from "./userSection";
import { Report } from "../others/report";
import { ItemPeek } from "./itemPeek";

type Props = {
    id: string;
    item: Item;
    sellerMe?: boolean;
    goodCount?: number;
    isGood?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
    reportCount?: number;
    userId: string | null;
    loggedIn: boolean;
};

export const VideoSection = ({ id, item, sellerMe, goodCount, isGood, page, reportCount, userId, loggedIn }: Props) => {
    return (
        <section className={styles.videoSection}>
            <VideoElem item={item} sellerMe={sellerMe} page={page} />
            <h3 className={styles.title}>{item.Video?.title}</h3>
            <ItemPeek item={item} />
            <CountElem id={id} item={item} sellerMe={sellerMe} goodCount={goodCount} isGood={isGood} page={page} loggedIn={loggedIn} />
            <Summary id={id} item={item} sellerMe={sellerMe} page={page} />
            {["normal", "admin"].includes(page) && (
                <>
                <UserSection item={item} sellerMe={sellerMe} page={page as "normal" | "admin"} userId={userId} />
                <Report id={id} itemReport={true} page={page as "normal" | "admin"} reportCount={reportCount} />
                </>
            )}
        </section>
    );
};