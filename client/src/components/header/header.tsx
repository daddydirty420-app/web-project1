import { authOptions } from "@/lib/auth";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { getServerSession } from "next-auth";
import Link from "next/link";
import styles from "./header.module.css";
import { SearchInputMobile } from "./searchInputMobile";
import { SearchInputPC } from "./searchInputPC";

export default async function Header() {
    const session = await getServerSession(authOptions);

    const loggedIn = !!session?.user;

    return (
        <header className={styles.header}>
            <section className={styles.headerContainer}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoArea}>
                        <p className={styles.logoText}>LOGO</p>
                    </div>
                </Link>

                <SearchInputPC loggedIn={loggedIn} />
                <SearchInputMobile loggedIn={loggedIn} />

                <nav className={styles.menuNav}>
                    {!loggedIn && (
                        <div className="flex mr-[1rem]">
                            <p className={styles.menuP}>
                                <Link href="/login">ログイン</Link>
                            </p>
                            <p className={styles.menuP}>
                                <Link href="/signup">会員登録</Link>
                            </p>
                        </div>
                    )}

                    {loggedIn && (
                        <p className={clsx("block mr-[1rem]", styles.menuP)}>
                            <Link href="/my-page">マイページ</Link>
                        </p>
                    )}

                    <Link href={loggedIn ? "/upload/before" : "/login"} className={styles.uploadDiv}>
                        <FontAwesomeIcon icon={faUpload} className={styles.uploadIcon} />
                        <p className={styles.uploadP}>出品する</p>
                    </Link>
                </nav>
            </section>
        </header>
    );
}
