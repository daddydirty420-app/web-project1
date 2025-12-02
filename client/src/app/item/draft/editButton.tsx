import Link from "next/link";
import styles from "./draft.module.css";

type Props = {
    id: string;
}

export default function EditButton({ id }: Props) {
    return <Link href={`/upload/draft/${id}`} className={styles.editButton}>編集する</Link>;
}