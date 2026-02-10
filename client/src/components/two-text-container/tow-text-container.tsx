import clsx from "clsx";
import { ReactNode } from "react";
import styles from './tow-text-container.module.css';

type RowTextContainerProps = {
    heading: string,
    children: ReactNode,
    flex?: boolean
};

export const RowTextContainer = ({ heading, children, flex = false }: RowTextContainerProps) => {
    const divClass = flex
    ? clsx('flex mb-2', styles.container)
    : clsx('block mb-3', styles.container);

    const headingClass = flex
    ? styles.heading
    : clsx('mb-1', styles.heading);

    return (
        <div className={divClass}>
            <p className={headingClass}>{heading}</p>
            <p>{children}</p>
        </div>
    );
}