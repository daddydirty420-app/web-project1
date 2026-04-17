"use client";

import { Toaster } from "react-hot-toast";

export const ToastBoundary = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 2500,
                    style: {
                        background: "#111",
                        color: "#fff",
                        fontSize: "13px",
                        borderRadius: "8px",
                    },
                }}
            />
            {children}
        </>
    );
};
