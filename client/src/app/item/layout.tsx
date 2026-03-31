import { ToastBoundary } from "@/providers/toastBoundary";

export default function ItemLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
};