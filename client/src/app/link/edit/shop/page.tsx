import { SITE } from "@/config/site";
import { Metadata } from "next";
import { fetchMyShop } from "../../api/edit/server";
import LinkUI from "../../linkUI";
import { LinkSection } from "./linkSection";

export const metadata: Metadata = {
    title: "ショップ情報設定",
    description: `${SITE.shopName}をご利用の際の各種ショップ情報はこちらから編集リンクページへアクセスできます。`,
    robots: {
        index: false,
        follow: false,
    },
};

export default async function Page() {
    const data = await fetchMyShop();

    return (
        <LinkUI title="ショップ情報設定">
            <LinkSection shopId={data.shop.id} />
        </LinkUI>
    );
}
