import { Container } from '@/components';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { Metadata } from 'next';
import { Content } from './content';

export const metadata: Metadata = {
    title: "プライバシーポリシー",
    description: "プライバシーポリシーはこちら！",
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
    )
}