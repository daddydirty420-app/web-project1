import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from 'next/image';
import styles from './header.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import SearchInput from "./searchInput";

export default async function Header() {
    const session = await getServerSession(authOptions);

    const loggedIn = !!session?.user;

    return (
        <header className={styles.header}>
            <section className={styles.headerConteiner}>
                <Link href='/' className={styles.logo}>
                    <Image
                    src="/logo.png"
                    alt='FLEX OUTDOORロゴ　トップページへ'
                    layout='intrinsic'
                    width={102}
                    height={34}
                    priority
                    quality={25}
                    />
                </Link>

                <div className={styles.searchDiv}>
                    <SearchInput />
                    <p className={styles.categorySearch}><Link href='/search/category'>カテゴリー検索</Link></p>
                </div>

                <nav className={styles.menuNav}>
                    {!loggedIn && (
                        <div className='flex mr-[1rem]'>
                            <p className={styles.menuP}><Link href='/login'>ログイン</Link></p>
                            <p className={styles.menuP}><Link href='/signup'>会員登録</Link></p>
                        </div>
                    )}

                    {loggedIn && (
                        <p className={clsx('block mr-[1rem]', styles.menuP)}><Link href='/my-page'>マイページ</Link></p>
                    )}

                    <Link href={loggedIn ? '/upload/before' : '/login'} className={styles.uploadDiv}>
                        <FontAwesomeIcon icon={faUpload} className={styles.uploadIcon} />
                        <p className={styles.uploadP}>出品する</p>
                    </Link>
                </nav>
            </section>
        </header>
    );
}