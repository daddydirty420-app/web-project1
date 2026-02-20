import { Container, TitleAndBack } from "@/components";
import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export default function ReportUI({ title, children }: Props) {
    return (
        <Container>
            <TitleAndBack title={title} />
            {children}
        </Container>
    );
};