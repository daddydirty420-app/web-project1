import clsx from "clsx";
import { ReactNode } from "react";
import styles from './styles/guide-small.module.css';

type GuideSmallProps = {
    children: ReactNode,
    className?: string
};

export const GuideSmall = ({ children, className }: GuideSmallProps) => {
    return <small className={clsx('block text-gray-500 mt-2', styles.small, className)}>{children}</small>;
}