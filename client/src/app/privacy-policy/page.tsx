import { Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Metadata } from "next";
import { SITE } from "../../config/site";
import { Content } from "./content";

export const metadata: Metadata = {
    title: "プライバシーポリシー",
    description: `${SITE.appName}のプライバシーポリシーはこちら！`,
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
