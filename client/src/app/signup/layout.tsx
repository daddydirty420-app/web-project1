import { ToastBoundary } from "@/providers/toastBoundary";

export default function SignupLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
};