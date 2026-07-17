import { Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Metadata } from "next";
import { Content } from "./content";
import { SITE } from "../../../config/site";

export const metadata: Metadata = {
    title: "ご利用ガイド - ショップガイド",
    description: `「${SITE.appName}」の限定機能や登録方法についてわかりやすく解説しています。`,
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
