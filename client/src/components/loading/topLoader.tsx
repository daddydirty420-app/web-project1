import styles from "./loading.module.css";

type Props = {
    loading: boolean;
};

export const TopLoader = ({ loading }: Props) => {
    if (!loading) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.spinner} />
        </div>
    );
};