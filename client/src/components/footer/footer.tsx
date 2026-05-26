import { authOptions } from "@/lib/auth";
import { faCircleUser, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faBell, faHome, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { fetchUnreadCount } from "./api/server";
import styles from "./footer.module.css";

export default async function Footer() {
    const session = await getServerSession(authOptions);

    const loggedIn = !!session?.user;

    let unreadCount = 0;

    if (loggedIn) {
        const data = await fetchUnreadCount();
        unreadCount = data.unreadCount;
    }

    return (
        <footer className={styles.footer}>
            <Link href="/" className={styles.linkDiv}>
                <FontAwesomeIcon icon={faHome} className={styles.linkIcon} />
                <p className={styles.linkP}>ホーム</p>
            </Link>

            <Link href={loggedIn ? "/order/list/purchased" : "/login"} className={styles.linkDiv}>
                <FontAwesomeIcon icon={faShoppingBag} className={styles.linkIcon} />
                <p className={styles.linkP}>購入した商品</p>
            </Link>

            <Link href={loggedIn ? "/upload/before" : "/login"} className={styles.linkDiv}>
                <FontAwesomeIcon icon={faSquarePlus} className={styles.uploadIcon} />
            </Link>

            <Link href={loggedIn ? "/notification" : "/login"} className={styles.linkDiv}>
                <div className={styles.notifDiv}>
                    <FontAwesomeIcon icon={faBell} className={styles.linkIcon} />
                    {loggedIn && unreadCount >= 1 && (
                        <svg width={8} height={8} className={styles.unreadIcon}>
                            <circle cx={4} cy={4} r={4} fill="#007BFF" />
                        </svg>
                    )}
                </div>
                <p className={styles.linkP}>お知らせ</p>
            </Link>

            <Link href={loggedIn ? "/my-page" : "/login"} className={styles.linkDiv}>
                <FontAwesomeIcon icon={faCircleUser} className={styles.linkIcon} />
                <p className={styles.linkP}>マイページ</p>
            </Link>
        </footer>
    );
}
