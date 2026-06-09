"use client";

import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export const BottomSheet = ({ children }: Props) => {
    return <>{children}</>;
};
