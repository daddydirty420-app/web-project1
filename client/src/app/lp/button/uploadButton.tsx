import styles from "../lp.module.css";
import Link from "next/link";

type Props = {
    loggedIn: boolean;
};

export default function UploadButton({ loggedIn }: Props) {
    return <Link href={loggedIn ? "/upload/before" : "/login"} className={styles.uploadButton}>出品する</Link>;
};