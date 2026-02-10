import { Container, Header, Footer } from '@/components';
import { Metadata } from 'next';
import { Content } from './content';

export const metadata: Metadata = {
    title: "ご利用ガイド - ショップガイド",
    description: "「〇〇」の限定機能や登録方法についてわかりやすく解説しています。",
    robots: {
        index: false,
        follow: false,
    }
};

export default function Page() {
    return (
        <>
            <Header />

            <Container header>
                <Content />
            </Container>

            <Footer />
        </>
    );
}