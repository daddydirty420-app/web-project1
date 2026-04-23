import Link from "next/link";
import { ReactNode } from "react";
import styles from "./normal-link.module.css";

type NormalLinkProps = {
    url: string;
    children: ReactNode;
};

export const ChildrenLink = ({ children, url }: NormalLinkProps) => {
    return (
        <Link href={url} className={styles.normal}>
            <p>{children}</p>
        </Link>
    );
};
