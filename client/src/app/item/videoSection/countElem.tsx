import styles from "./video.module.css";
import { Item } from "../itemPageTypes";
import Good from "./good";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Session } from "next-auth";

type Props = {
    id: string;
    item: Item;
    sellerMe?: boolean;
    session: Session | null;
    goodCount?: number;
    isGood?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
};

export default function CountElem({ id, item, sellerMe, session, goodCount, isGood, page }: Props) {
    return (
        <section className={styles.countElem}>
            {["normal", "admin"].includes(page) && (
                <>
                <div className={styles.goodDiv}>
                    <Good id={id} sellerMe={sellerMe} session={session} initialCount={goodCount} initialGood={isGood} page={page as "normal" | "admin"} />
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