import { Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Metadata } from "next";
import { SITE } from "../../config/site";
import { Content } from "./content";

export const metadata: Metadata = {
    title: "利用規約",
    description: `${SITE.appName}の利用規約はこちら！`,
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
