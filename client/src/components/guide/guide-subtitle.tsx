import styles from './styles/guide-subtitle.module.css';

type GuideSubTitleProps = {
    text: string,
    mTop?: boolean
};

export const GuideSubTitle = ({ text, mTop = false }: GuideSubTitleProps) => {
    const classNames = mTop
    ? `${styles.subtitle} ${styles.mTop}`
    : styles.subtitle;

    return <p className={classNames}>{text}</p>;
}