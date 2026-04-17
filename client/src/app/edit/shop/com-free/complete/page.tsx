import { Metadata } from "next";
import Element from "./element";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "事業形態変更リクエスト完了",
        description:
            "事業形態の変更リクエストが完了しました。審査完了までしばらくお待ちください。（事業形態の変更には審査が必要になります。審査には1~2週間ほどお時間を頂戴しております。）",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default function Page() {
    return <Element />;
}
