import styles from "./ss.module.css";

type Props = {
    nextClick: () => void;
    backClick: () => void;
};

export default function ButtonDiv({ nextClick, backClick }: Props) {
    return (
        <nav className={styles.buttonNav}>
            <button
            type="button"
            onClick={backClick}
            className={styles.backButton}
            >
                戻る
            </button>

            <button
            type="button"
            onClick={nextClick}
            className={styles.nextButton}
            >
                次へ
            </button>
        </nav>
    );
};