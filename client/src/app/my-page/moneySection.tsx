import { IconAlertTriangle } from "@tabler/icons-react";
import styles from "./mypage.module.css";
import { User } from "./types";

type Props = {
    user: User;
};

export const MoneySection = ({ user }: Props) => {
    // alert残り日数
    const setAfterDate = (date: Date | string): string => {
        const now = new Date();
        const d = typeof date === "string" ? new Date(date) : date;
        const diffMs = d.getTime() - now.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffDay > 1) {
            return `${diffDay}日`;
        } else {
            return "残りわずか";
        }
    };

    const pointLots = user.PointLots;
    const uriagekinLots = user.UriagekinLots;

    return (
        <div className={styles.block}>
            <section className={styles.moneySection}>
                <div className={styles.moneyDiv}>
                    <p className={styles.moneyP}>売上金</p>
                    <p className={styles.money}>￥{user.uriagekin?.toLocaleString()}</p>
                </div>
                <div className={styles.moneyDiv}>
                    <p className={styles.moneyP}>ポイント</p>
                    <p className={styles.money}>{user.points?.toLocaleString()}pt</p>
                </div>
            </section>

            {pointLots && pointLots?.alertPoints > 0 && (
                <div className={styles.alertPointsFlex}>
                    <div className={styles.alertIconBox}>
                        <IconAlertTriangle size={18} stroke={2} className={styles.alertIcon} />
                    </div>

                    <p className={styles.alertPointsText}>
                        あと<span className={styles.alertBold}>{setAfterDate(pointLots.expires_at)}</span>で
                        <span className={styles.alertBold}>
                            {pointLots?.alertPoints.toLocaleString()}
                            pt
                        </span>
                        が失効します
                    </p>
                </div>
            )}
        </div>
    );
};
