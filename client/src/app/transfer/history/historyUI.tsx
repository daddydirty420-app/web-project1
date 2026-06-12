import { Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function HistorySearchUI({ children }: Props) {
    return (
        <>
            <Header />

            <Container header>{children}</Container>

            <Footer />
        </>
    );
}
