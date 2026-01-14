"use client";

import { Toaster } from "react-hot-toast";

export const ToastBoundary = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
        <Toaster position="top-center" />
        {children}
        </>
    );
};