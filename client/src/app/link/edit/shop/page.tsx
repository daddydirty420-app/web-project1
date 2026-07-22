import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SITE } from "@/config/site";
import { authOptions } from "@/lib/auth";
import { LinkSection } from "./linkSection";
import LinkUI from "../../linkUI";

export const metadata: Metadata = {
    title: "ショップ情報設定",
    description: `${SITE.shopName}をご利用の際の各種ショップ情報はこちらから編集リンクページへアクセスできます。`,
    robots: {
        index: false,
        follow: false,
    },
};

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    return (
        <LinkUI title="個人情報設定">
            <LinkSection shopId={} />
        </LinkUI>
    );
}
