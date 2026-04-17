import { ToastBoundary } from "@/providers/toastBoundary";

export default function ItemListLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
}
