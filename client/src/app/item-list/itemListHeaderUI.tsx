import { Back, Container } from "@/components";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function ItemListHeaderUI({ children }: Props) {
    return (
        <Container>
            <Back />
            {children}
        </Container>
    );
}
