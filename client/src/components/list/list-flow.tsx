import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './list.module.css';

type ListFrowProps = {
    children: ReactNode;
    number: number;
};

export const ListFlow = ({ children, number }: ListFrowProps) => {
    return (
        <li className="flex gap-2 items-center mb-2">
            <span className="text-(--theme) text-base font-medium">{number}.</span>
            <div className={clsx('break-words w-full', styles.listText)}>{children}</div>
        </li>
    );
};
