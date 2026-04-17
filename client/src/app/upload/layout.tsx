import { ToastBoundary } from '@/providers/toastBoundary';

export default function UploadLayout({ children }) {
    return <ToastBoundary>{children}</ToastBoundary>;
}
