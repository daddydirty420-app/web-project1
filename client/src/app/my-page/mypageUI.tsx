import { Back, Container, Header, Footer } from "@/components";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function MypageUI({ children }: Props) {
    return (
        <>
        <Header />

        <Container header>
            <Back />
            {children}
        </Container>

        <Footer />
        </>
    );
};