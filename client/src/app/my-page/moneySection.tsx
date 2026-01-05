import styles from "./mypage.module.css";
import { User } from "./types";

type Props = {
    user: User;
};

export default function MoneySection({ user }: Props) {
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
        </div>
    );
}