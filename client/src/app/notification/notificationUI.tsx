import { Back, Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function NotificationUI({ children }: Props) {
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
}
