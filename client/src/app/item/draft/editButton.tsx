import Link from "next/link";
import styles from "./draft.module.css";

type Props = {
    id: string;
}

export const EditButton = ({ id }: Props) => {
    return <Link href={`/upload/draft/${id}`} className={styles.editButton}>編集する</Link>;
}