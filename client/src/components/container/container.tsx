import { ReactNode } from 'react';
import styles from './container.module.css';

type ContainerProps = {
    children: ReactNode,
    header?: boolean
};

export const Container = ({ children, header = false }: ContainerProps) => {
    const classNames = header
    ? styles.headerContainer
    : styles.default;

    return (
        <div className={classNames}>
            {children}
        </div>
    );
}