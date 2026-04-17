import { Hero } from './hero';
import { HeaderGreen } from './headerGreen';
import { Button } from '../button/button';

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
