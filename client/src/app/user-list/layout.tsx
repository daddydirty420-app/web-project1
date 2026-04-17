import { ToastBoundary } from '@/providers/toastBoundary';

export default function UserListLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
}
