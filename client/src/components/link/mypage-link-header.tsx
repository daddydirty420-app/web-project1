import styles from './normal-link.module.css';

type MypageLinkHeaderProps = {
    text: string
};

export default function MypageLinkHeader({ text }: MypageLinkHeaderProps) {
    return <h2 className={styles.mypageHeader}>{text}</h2>;
}