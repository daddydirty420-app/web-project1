import { Metadata } from "next";
import { SITE } from "../../config/site";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import PersonalInformationUI from "./personalInformationUI";
import { LinkSection } from "./linkSection";

export const metadata: Metadata = {
    title: "個人情報設定",
    description: `${SITE.appName}をご利用の際の各種個人情報・ログイン情報はこちらから編集ページへアクセスできます。`,
    robots: {
        index: false,
        follow: false,
    },
};

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    return (
        <PersonalInformationUI title="個人情報設定">
            <LinkSection />
        </PersonalInformationUI>
    )
}
