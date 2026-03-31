import { TitleAndBack, Container, AccordionGrid } from '@/components';
import { GuideLink } from '@/components/guide';
import { Metadata } from 'next';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';

export const metadata: Metadata = {
    title: "ご利用ガイド",
    description: "ご不明な点などあればこちら！FLEX OUTDOORについてわかりやすく解説しています。",
    robots: {
        index: false,
        follow: false
    }
}

export default function Page() {
    return (
        <>
            <Header />

            <Container header>
                <TitleAndBack title='使い方ガイド' />

                <AccordionGrid>
                    <GuideLink heading='会員登録やログイン、マイページについて' url='guide/account' />
                    <GuideLink heading='購入者の方' url='guide/buyer' />
                    <GuideLink heading='出品者の方' url='guide/seller' />
                    <GuideLink heading='ショップ' url='guide/shop' />
                    <GuideLink heading='禁止行為・ペナルティ' url='guide/penalty' />
                </AccordionGrid>
            </Container>

            <Footer />
        </>
    )
}