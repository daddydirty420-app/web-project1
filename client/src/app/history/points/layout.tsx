import { ToastBoundary } from "@/providers/toastBoundary";

export default function PointListLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
}
