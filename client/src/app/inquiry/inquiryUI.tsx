import { Container, Title } from "@/components";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export default function InquiryUI({ title, children }: Props) {
    return (
        <>
        <Header />

        <Container header>
            <Title title={title} />
            {children}
        </Container>

        <Footer />
        </>
    );
}