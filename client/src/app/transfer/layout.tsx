import { ToastBoundary } from "@/providers/toastBoundary";

export default function TransferLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
};