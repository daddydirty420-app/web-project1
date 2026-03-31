import Link from 'next/link';
import styles from './normal-link.module.css';
import { ReactNode } from 'react';

type NormalLinkProps = {
    url: string,
    children: ReactNode,
};

export const ChildrenLink = ({ children, url }: NormalLinkProps) => {
    return (
        <Link href={url} className={styles.normal}>
            <p>{children}</p>
        </Link>
    );
}