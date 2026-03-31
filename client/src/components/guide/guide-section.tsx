import clsx from "clsx";
import { ReactNode } from "react";
import styles from '@/styles/guide.module.css';

type GuideSectionProps = {
    heading: string,
    children: ReactNode
};

export const GuideSection = ({ heading, children }: GuideSectionProps) => {
    return (
        <div>
            <p className={clsx('mt-4 mb-2', styles.PHeading)}>{heading}</p>
            <div className={styles.sectionChild}>{children}</div>
        </div>
    );
}