import { Container } from "@/components";
import { TwoColumn } from "./two-column";
import { HeaderSection } from "./header/headerSection";
import { FooterImage } from "./footer/footerImage";
import { FooterSitemap } from "./footer/footerSitemap";
import { Items } from "@/types/itemListTypes";

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
    )
}