import styles from "./title-back.module.css";

type Props = {
    title: string;
};

export default function Title({ title }: Props) {
    return (
        <div className="mb-2">
            <h1 className={styles.title}>{title}</h1>
        </div>
    );
};