import { TitleAndBack, Container } from "@/components";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { TokuteiContainer } from "@/components/tokutei";
import { Metadata } from "next";
import { Content } from "./content";

export const metadata: Metadata = {
    title: "事業概要",
    description: "〇〇の事業概要はこちら！",
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
                <TitleAndBack title="事業概要" />

                <TokuteiContainer>
                    <Content />
                </TokuteiContainer>
            </Container>

            <Footer />
        </>
    );
}
