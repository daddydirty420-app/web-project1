import { Container, TitleAndBack } from "@/components";
import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export default function EditUI({ title, children }: Props) {
    return (
        <Container>
            <TitleAndBack title={title} />
            {children}
        </Container>
    );
}
