import { ToastBoundary } from '@/providers/toastBoundary';

export default function LoginLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
}
