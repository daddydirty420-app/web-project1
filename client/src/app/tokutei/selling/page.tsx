import { Container, Header, Footer } from '@/components';
import { Metadata } from 'next';
import { Content } from './content';

export const metadata: Metadata = {
    title: "特定商取引法に基づく表記",
    description: "特定商取引法に基づく表記はこちら！",
    robots: {
        index: false,
        follow: false
    }
};

export default function TokuteiSelling() {
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