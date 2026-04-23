import { Button } from "../button/button";
import { HeaderGreen } from "./headerGreen";
import { Hero } from "./hero";

type Props = {
    shopPage?: boolean;
    loggedIn: boolean;
};

export const HeaderSection = ({ shopPage, loggedIn }: Props) => {
    return (
        <header>
            <Hero shopPage={shopPage} />
            <HeaderGreen shopPage={shopPage} />
            <Button shopPage={shopPage} loggedIn={loggedIn} />
        </header>
    );
};
