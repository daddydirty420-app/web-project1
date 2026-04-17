import Link from 'next/link';
import styles from './normal-link.module.css';

type NormalLinkProps = {
    url: string;
    text: string;
};

export const NormalLink = ({ text, url }: NormalLinkProps) => {
    return (
        <Link href={url} className={styles.normal}>
            <p>{text}</p>
        </Link>
    );
};
