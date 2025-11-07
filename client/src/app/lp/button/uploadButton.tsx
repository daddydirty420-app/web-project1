import styles from "../lp.module.css";
import Link from "next/link";
import { Session } from "next-auth";

type Props = {
    session: Session | null;
};

export default function UploadButton({ session }: Props) {
    const loggedIn = !!session?.user;

    return (
        <>
        {loggedIn && <Link href="/upload/before" className={styles.uploadButton}>出品する</Link>}
        {!loggedIn && <Link href="/login" className={styles.uploadButton}>出品する</Link>}
        </>
    );
};