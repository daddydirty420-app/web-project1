import { Item } from "../itemPageTypes";
import styles from "./video.module.css";
import VideoElem from "./videoElem";
import CountElem from "./countElem";
import Summary from "./summary";
import UserSection from "./userSection";
import Report from "../others/report";
import { Session } from "next-auth";

type Props = {
    id: string;
    item: Item;
    sellerMe?: boolean;
    session: Session | null;
    accessToken: string | null;
    goodCount?: number;
    isGood?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
    reportCount?: number;
};

export default function VideoSection({ id, item, sellerMe, session, accessToken, goodCount, isGood, page, reportCount }: Props) {
    return (
        <section className={styles.videoSection}>
            <VideoElem item={item} sellerMe={sellerMe} accessToken={accessToken} page={page} />
            <h3 className={styles.title}>{item.Video?.title}</h3>
            <CountElem id={id} item={item} sellerMe={sellerMe} session={session} goodCount={goodCount} isGood={isGood} page={page} />
            <Summary id={id} item={item} sellerMe={sellerMe} page={page} />
            {["normal", "admin"].includes(page) && (
                <>
                <UserSection item={item} sellerMe={sellerMe} session={session} accessToken={accessToken} page={page as "normal" | "admin"} />
                <Report id={id} itemReport={true} page={page as "normal" | "admin"} reportCount={reportCount} />
                </>
            )}
        </section>
    );
};