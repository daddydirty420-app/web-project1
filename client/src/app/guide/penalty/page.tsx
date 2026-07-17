import { Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Metadata } from "next";
import { SITE } from "../../../config/site";
import { Content } from "./content";

export const metadata: Metadata = {
    title: "ご利用ガイド - 禁止行為・ペナルティ",
    description: `${SITE.appName}のユーザーの禁止行為とペナルティ等の処分についてわかりやすく解説しています。`,
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
