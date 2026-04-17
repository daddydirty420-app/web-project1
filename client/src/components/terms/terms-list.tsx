import styles from '@/styles/terms.module.css';

type TermsListProps = {
    number: number;
    text: string;
    fontSize?: 'default' | 'small';
};

export const TermsList = ({ number, text, fontSize = 'default' }: TermsListProps) => {
    return (
        <div className={`${styles.listParent} ${fontSize === 'small' ? styles.small : ''}`}>
            <span className={styles.listIndex}>{number}.</span>
            <p className="ml-[0.5em]">{text}</p>
        </div>
    );
};
