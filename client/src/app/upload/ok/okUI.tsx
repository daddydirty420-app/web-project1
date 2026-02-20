import { Container, Title } from "@/components";
import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export default function OkUI({ title, children }: Props) {
    return (
        <Container header>
            <Title title={title} />
            {children}
        </Container>
    );
}