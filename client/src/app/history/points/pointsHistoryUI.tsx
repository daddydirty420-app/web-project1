import { Container, TitleAndBack } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function PointHistoryUI({ children }: Props) {
    return (
        <>
            <Header />

            <Container header>
                <TitleAndBack title="ポイント履歴" />
                {children}
            </Container>

            <Footer />
        </>
    );
}
