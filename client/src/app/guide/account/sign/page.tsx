import { Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Metadata } from "next";
import { Content } from "./content";

export const metadata: Metadata = {
    title: "ご利用ガイド - 会員登録について",
    description: "〇〇の会員登録に関する基本操作等についてわかりやすく解説しています。",
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
