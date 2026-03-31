import { Container } from '@/components';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { Metadata } from 'next';
import { Content } from './content';

export const metadata: Metadata = {
    title: "ご利用ガイド - アカウントについて",
    description: "〇〇のログインやマイページ、プロフィール、個人情報など、アカウントの基本操作等についてわかりやすく解説しています。",
    robots: {
        index: false,
        follow: false
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