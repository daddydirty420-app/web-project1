import { ToastBoundary } from "@/providers/toastBoundary";

export default function ShopSignupLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
};