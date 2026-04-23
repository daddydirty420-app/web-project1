import { Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Metadata } from "next";
import { Content } from "./content";

export const metadata: Metadata = {
    title: "ご利用ガイド - 購入者の方",
    description: "〇〇の商品の閲覧から購入、取引、受け取りまで、わかりやすく解説しています。",
    robots: {
        index: false,
        follow: false,
    },
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
