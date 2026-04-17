import { Container } from '@/components';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { Metadata } from 'next';
import { Content } from './content';

export const metadata: Metadata = {
    title: '利用規約',
    description: '利用規約はこちら！',
    robots: {
        index: false,
        follow: false,
    },
};

export default function TermsAndConditions() {
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
