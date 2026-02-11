import { Back, Container } from "@/components";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
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