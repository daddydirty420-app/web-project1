import styles from './loading.module.css';

type Props = {
    loading: boolean;
};

export const TopLoader = ({ loading }: Props) => {
    return (
        <div className={`${styles.wrapper} ${loading ? styles.show : ''}`}>
            <div className={styles.spinner} />
        </div>
    );
};
