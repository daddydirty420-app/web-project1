import styles from './normal-link.module.css';

type MypageLinkHeaderProps = {
    text: string
};

export const MypageLinkHeader = ({ text }: MypageLinkHeaderProps) => {
    return <h2 className={styles.mypageHeader}>{text}</h2>;
}