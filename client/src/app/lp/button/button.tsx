import styles from "../lp.module.css";
import Link from "next/link";

type Props = {
    shopPage?: boolean;
    hasShop?: boolean;
    loggedIn: boolean;
};

export default async function Button({ shopPage, hasShop, loggedIn }: Props) {
    const signupPage = '/signup';
    const loginPage = '/login';
    const uploadPage = '/upload/before';
    const myPage = '/my-page';
    const shopSignPage = '/shop-signup/step1';

    return (
        <nav>
            {!shopPage && (
                <>
                {!loggedIn && (
                    <>
                    <Link href={signupPage} className={styles.greenButton}>会員登録</Link>
                    <p className={styles.buttonText}>会員登録は<span className="text-[var(--theme)]">無料</span></p>
                    <Link href={loginPage} className={styles.brownButton}>ログイン</Link>
                    </>
                )}
                {loggedIn && (
                    <>
                    <Link href={uploadPage} className={styles.greenButton}>出品する</Link>
                    <p className={styles.buttonText}><span className="text-[var(--theme)]">早期出品特典</span>あり</p>
                    <Link href={myPage} className={styles.brownButton}>マイページ</Link>
                    </>
                )}
                </>
            )}
            {shopPage && (
                <>
                {(!loggedIn || !hasShop) && (
                    <>
                    <Link href={loggedIn ? shopSignPage : loginPage} className={styles.greenButton}>ショップ登録</Link>
                    <p className={styles.buttonText}>ショップ登録は<span className="text-[var(--theme)]">無料</span></p>
                    </>
                )}
                {hasShop && (
                    <>
                    <Link href={uploadPage} className={styles.greenButton}>出品する</Link>
                    <p className={styles.buttonText}><span className="text-[var(--theme)]">早期出品特典</span>あり</p>
                    <Link href={myPage} className={styles.brownButton}>マイページ</Link>
                    </>
                )}
                </>
            )}
        </nav>
    );
};