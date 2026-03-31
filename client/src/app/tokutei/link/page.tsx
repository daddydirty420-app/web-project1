import { TitleAndBack, Container } from '@/components';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { NormalLink, NormalLinkContainer } from '@/components/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "特定商取引法に基づく表記 - リンク",
    description: "特定商取引法に基づく表記はこちら！",
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
            <TitleAndBack title='特定商取引法に基づく表記 - リンク' />

            <NormalLinkContainer>
                <NormalLink url='/tokutei' text='商品の購入・取引' />
                <NormalLink url='/tokutei/selling' text='出品・配送・売上・振込（出品者向け）' />
            </NormalLinkContainer>
        </Container>

        <Footer />
        </>
    );
}