import { Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Metadata } from "next";
import { SITE } from "../../../config/site";
import { Content } from "./content";

export const metadata: Metadata = {
    title: "ご利用ガイド - 出品者の方",
    description: `${SITE.appName}の出品から販売、取引、配送まで、わかりやすく解説しています。`,
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
