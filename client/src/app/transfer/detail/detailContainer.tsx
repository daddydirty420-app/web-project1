import { Back, Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function DetailContainer({ children }: Props) {
    return (
        <>
            <Header />

            <Container header>
                <Back url="/transfer/history" />
                {children}
            </Container>

            <Footer />
        </>
    );
}
