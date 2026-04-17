import { Metadata } from 'next';
import { Element } from './element';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'ショップ登録リクエスト完了 | ショップ登録',
        description:
            'ショップ登録はこちら！事業者向けの複数在庫出品、在庫管理システム、売上管理システム、特別なオプションなど、申請するとショップ会員のみの特別な機能をご利用いただけます。（審査に約2週間ほどお時間を頂戴いたします。）',
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default function Page() {
    return <Element />;
}
