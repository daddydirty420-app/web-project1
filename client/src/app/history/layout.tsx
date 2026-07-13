import { ToastBoundary } from "@/providers/toastBoundary";

export default function HistoryLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
}
