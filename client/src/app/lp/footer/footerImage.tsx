import styles from "../lp.module.css";
import Pic from "@/assets/images/pexels-xue-guangjian-815005-1687845.jpg";
import Image from "next/image";
import Link from "next/link";
import InquiryButton from "../button/inquiryButton";
import clsx from "clsx";
import { Session } from "next-auth";

type Props = {
    shopPage?: boolean;
    hasShop?: boolean;
    session: Session | null;
};

export default async function FooterImage({ shopPage, hasShop, session }: Props) {
    const loggedIn = !!session?.user;

    const signup = "/signup";
    const login = "/login";
    const shopSign = "/shop-signup/1";

    return (
        <>
        {!shopPage && !loggedIn && (
            <nav className={clsx(styles.footerImageNav, styles.normal)}>
                <Image
                src={Pic}
                alt="フッター画像　テントが張られてる丘から見える夕日"
                fill
                className="object-cover"
                />
                <p className={styles.bottomP1}>早期出品しない理由なんてない！</p>
                <p className={styles.bottomP2}>まずは無料会員登録！</p>
                <Link href={signup} className={styles.footerGreenB}>会員登録</Link>
                <Link href={login} className={styles.footerBrownB}>ログイン</Link>
            </nav>
        )}
        {shopPage && (!loggedIn || !hasShop) && (
            <>
            <nav className={clsx('mb-8', styles.footerImageNav, styles.shopPage)}>
                <Image
                src={Pic}
                alt="フッター画像　テントが張られてる丘から見える夕日"
                fill
                className="object-cover"
                />
                <p className={styles.bottomP1}>早期出品しない理由なんてない！</p>
                <p className={styles.bottomP2}>まずは無料会員登録！</p>
                <Link href={loggedIn ? shopSign : login } className={styles.footerGreenB}>ショップ登録</Link>
            </nav>
            <InquiryButton />
            </>
        )}
        </>
    );
};