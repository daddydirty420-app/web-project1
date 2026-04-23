import clsx from "clsx";
import { ReactNode } from "react";

type ListUlProps = {
    children: ReactNode;
    className?: string;
};

export const ListUlSecond = ({ children, className }: ListUlProps) => {
    return <ul className={clsx("ml-[2rem] mt-3", className)}>{children}</ul>;
};
