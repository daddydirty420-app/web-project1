import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import styles from './footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingBag, faBell } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus, faCircleUser } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';
import { cookies } from "next/headers";

export const Footer = async () => {
    const session = await getServerSession(authOptions);
    
    const loggedIn = !!session?.user;
        
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    let unreadCount = 0;

    if (loggedIn) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification/unread-count`, {
            headers: {
                Authorization: `Bearer ${accessToken ?? ""}`,
            },
            cache: 'no-store',
        });

        const data = await res.json();
        unreadCount = data.unreadCount;
    }

    return (
        <footer className={styles.footer}>
            <Link href='/' className={styles.linkDiv}>
                <FontAwesomeIcon icon={faHome} className={styles.linkIcon} />
                <p className={styles.linkP}>ホーム</p>
            </Link>

            <Link href={loggedIn ? '/item-list/purchased' : '/login'} className={styles.linkDiv}>
                <FontAwesomeIcon icon={faShoppingBag} className={styles.linkIcon} />
                <p className={styles.linkP}>購入した商品</p>
            </Link>

            <Link href={loggedIn ? '/upload/before' : '/login'} className={styles.linkDiv}>
                <FontAwesomeIcon icon={faSquarePlus} className={styles.uploadIcon} />
            </Link>

            <Link href={loggedIn ? '/notification' : '/login'} className={styles.linkDiv}>
                <div className={styles.notifDiv}>
                    <FontAwesomeIcon icon={faBell} className={styles.linkIcon} />
                    {loggedIn && unreadCount >= 1 && (
                        <svg width={8} height={8} className={styles.unreadIcon}>
                            <circle cx={4} cy={4} r={4} fill='#007BFF' />
                        </svg>
                    )}
                </div>
                <p className={styles.linkP}>お知らせ</p>
            </Link>

            <Link href={loggedIn ? '/my-page' : '/login'} className={styles.linkDiv}>
                <FontAwesomeIcon icon={faCircleUser} className={styles.linkIcon} />
                <p className={styles.linkP}>マイページ</p>
            </Link>
        </footer>
    );
};