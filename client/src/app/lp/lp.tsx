import { Container } from "@/components";
import { Items } from "@/types/itemListTypes";
import { FooterImage } from "./footer/footerImage";
import { FooterSitemap } from "./footer/footerSitemap";
import { HeaderSection } from "./header/headerSection";
import { TwoColumn } from "./two-column";

type Res = {
    items: Items[];
    totalPages: number;
};

type Props = {
    shopPage?: boolean;
    hasShop?: boolean;
    itemList: Res;
    loggedIn: boolean;
};

export const Lp = ({ shopPage, hasShop, itemList, loggedIn }: Props) => {
    return (
        <>
            <HeaderSection shopPage={shopPage} loggedIn={loggedIn} />

            <Container>
                <TwoColumn shopPage={shopPage} itemList={itemList} loggedIn={loggedIn} />
            </Container>

            <FooterImage shopPage={shopPage} hasShop={hasShop} loggedIn={loggedIn} />
            <FooterSitemap />
        </>
    );
};
