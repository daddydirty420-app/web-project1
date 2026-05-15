import { ToastBoundary } from "@/providers/toastBoundary";

export default function NotificationLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
}
