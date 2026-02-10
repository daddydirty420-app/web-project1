import { ReactNode } from "react";
import clsx from "clsx";

type ListUlProps = {
    children: ReactNode,
    className?: string
};

export const ListUlSecond = ({ children, className }: ListUlProps) => {
    return <ul className={clsx("ml-[2rem] mt-3", className)}>{children}</ul>;
}