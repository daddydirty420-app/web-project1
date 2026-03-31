import { Container, TitleAndBack } from "@/components";
import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export default function UploadUI({ title, children }: Props) {
    return (
        <Container>
            <TitleAndBack title={title} />
            {children}
        </Container>
    );
};