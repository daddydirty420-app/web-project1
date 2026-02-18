import styles from "./ok.module.css";

type Props = {
    name: string;
};

export const OkText = ({ name }: Props) => {
    return (
        <div className={styles.okTextDiv}>
            <p className={styles.okText}>
                <span className={styles.bold}>{name}</span>
                の出品が完了しました。
                ただいまより商品の販売が開始されます。
            </p>
        </div>
    );
};

