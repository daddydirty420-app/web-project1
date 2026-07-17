import styles from "@/styles/terms.module.css";

type TermsListSecondProps = {
    alphabet: string;
    text: string;
};

export const TermsListSecond = ({ alphabet, text }: TermsListSecondProps) => {
    return (
        <div className={styles.listParent}>
            <span className={styles.listIndex}>{alphabet}.</span>
            <p className="ml-[0.5em]">{text}</p>
        </div>
    );
};
