import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "メール認証 | FLEX OUTDOOR",
    description: "認証コード",
    robots: {
        index: false,
        follow: false
    }
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
};