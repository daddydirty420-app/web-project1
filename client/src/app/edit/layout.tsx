import { ToastBoundary } from "@/providers/toastBoundary";

export default function EditLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
};