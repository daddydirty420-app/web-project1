import styles from '@/styles/tokutei.module.css';

type SecondHeaderProps = {
    text: string,
};

export const SecondHeader = ({ text }: SecondHeaderProps) => {
    return <h3 className={styles.secondHeader}>{text}</h3>;
}