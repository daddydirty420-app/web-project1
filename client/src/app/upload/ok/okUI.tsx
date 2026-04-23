import { Container, Title } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export default function OkUI({ title, children }: Props) {
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
