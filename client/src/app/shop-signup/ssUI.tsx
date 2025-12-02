import { Container, Title } from "@/components";
import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export default function SSUI({ title, children }: Props) {
    return (
        <Container>
            <Title title={title} />
            {children}
        </Container>
    );
};