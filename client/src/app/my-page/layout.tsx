import { ToastBoundary } from "@/providers/toastBoundary";

export default function MypageLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
};