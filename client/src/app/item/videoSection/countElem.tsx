import styles from "./video.module.css";
import { Item } from "../itemPageTypes";
import Good from "./good";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

type Props = {
    id: string;
    item: Item;
    sellerMe?: boolean;
    goodCount?: number;
    isGood?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
    loggedIn: boolean;
};

export default function CountElem({ id, item, sellerMe, goodCount, isGood, page, loggedIn }: Props) {
    return (
        <section className={styles.countElem}>
            {["normal", "admin"].includes(page) && (
                <>
                <div className={styles.goodDiv}>
                    <Good id={id} sellerMe={sellerMe} initialCount={goodCount} initialGood={isGood} page={page as "normal" | "admin"} loggedIn={loggedIn} />
                </div>

                <div className="block text-center">
                    <p className={styles.countNumber}>{item.Video?.play_count}</p>
                    <p className={styles.countText}>再生回数</p>
                </div>

                <div className="block text-center">
                    <p className={styles.countNumber}>{formatRelativeTime(item.uploaded_date)}</p>
                    <p className={styles.countText}>出品日</p>
                </div>
                </>
            )}

            {["draft", "confirm"].includes(page) && (
                <div className={styles.dateFlex}>
                    <p className={styles.countText}>保存日時：</p>
                    <p className={styles.countNumber}>{formatRelativeTime(item.save_at)}</p>
                </div>
            )}

            {page === "deleted" && (
                <div className={styles.dateFlex}>
                    <p className={styles.countText}>削除日時：</p>
                    <p className={styles.countNumber}>{formatRelativeTime(item.deleted_at)}</p>
                </div>
            )}
        </section>
    );
};