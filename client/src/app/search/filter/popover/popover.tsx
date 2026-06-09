"use client";

import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    onClose: () => void;
};

export const Popover = ({ children, onClose }: Props) => {
    return <>{children}</>;
};
