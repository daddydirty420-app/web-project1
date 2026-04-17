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
    likeCount?: number;
    isLike?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
    reportCount?: number;
    userId: string | null;
    loggedIn: boolean;
};

export const VideoSection = ({ id, item, sellerMe, likeCount, isLike, page, reportCount, userId, loggedIn }: Props) => {
    return (
        <section className={styles.videoSection}>
            <VideoElem item={item} sellerMe={sellerMe} page={page} />
            <h3 className={styles.title}>{item.Video?.title}</h3>
            <ItemPeek item={item} />
            <CountElem
                id={id}
                item={item}
                sellerMe={sellerMe}
                likeCount={likeCount}
                isLike={isLike}
                page={page}
                loggedIn={loggedIn}
            />
            <Summary id={id} item={item} sellerMe={sellerMe} page={page} />
            {["normal", "admin"].includes(page) && (
                <>
                    <UserSection item={item} sellerMe={sellerMe} page={page as "normal" | "admin"} userId={userId} />

                    {!sellerMe && (
                        <Report id={id} itemReport={true} page={page as "normal" | "admin"} reportCount={reportCount} />
                    )}
                </>
            )}
        </section>
    );
};
