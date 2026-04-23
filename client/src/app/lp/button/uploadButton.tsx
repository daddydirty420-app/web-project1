import Link from "next/link";
import styles from "../lp.module.css";

type Props = {
    loggedIn: boolean;
};

export const UploadButton = ({ loggedIn }: Props) => {
    return (
        <Link href={loggedIn ? "/upload/before" : "/login"} className={styles.uploadButton}>
            出品する
        </Link>
    );
};
