import { ToastBoundary } from "@/providers/toastBoundary";

export default function TransfarLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
};