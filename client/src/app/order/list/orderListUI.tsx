import { Back, Container } from "@/components";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function OrderListUI({ children }: Props) {
    return (
        <Container>
            <Back />
            {children}
        </Container>
    );
}