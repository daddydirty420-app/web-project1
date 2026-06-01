import { ToastBoundary } from "@/providers/toastBoundary";

export default function SearchItemListLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
}
