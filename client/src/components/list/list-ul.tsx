import { ReactNode } from "react";
import clsx from "clsx";

type ListUlProps = {
    children: ReactNode,
    className?: string
};

export const ListUl = ({ children, className }: ListUlProps) => {
    return <ul className={clsx("ml-[2rem] mt-3", className)}>{children}</ul>;
}