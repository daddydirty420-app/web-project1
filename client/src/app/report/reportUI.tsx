import { Container, TitleAndBack } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export default function ReportUI({ title, children }: Props) {
    return (
        <>
        <Header />

        <Container header>
            <TitleAndBack title={title} />
            {children}
        </Container>

        <Footer />
        </>
    );
};