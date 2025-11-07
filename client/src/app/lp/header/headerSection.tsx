import Hero from "./hero";
import HeaderGreen from "./headerGreen";
import Button from "../button/button";
import { Session } from "next-auth";

type Props = {
    shopPage?: boolean;
    session: Session | null;
};

export default function HeaderSection({ shopPage, session }: Props) {
    return (
        <header>
            <Hero shopPage={shopPage} />
            <HeaderGreen shopPage={shopPage} />
            <Button shopPage={shopPage} session={session} />
        </header>
    );
};