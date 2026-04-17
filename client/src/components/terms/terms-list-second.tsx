import styles from '@/styles/terms.module.css';

type TermsListSecondProps = {
    alfabet: string;
    text: string;
};

export const TermsListSecond = ({ alfabet, text }: TermsListSecondProps) => {
    return (
        <div className={styles.listParent}>
            <span className={styles.listIndex}>{alfabet}.</span>
            <p className="ml-[0.5em]">{text}</p>
        </div>
    );
};
