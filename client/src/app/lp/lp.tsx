import { Container } from "@/components";
import TwoColumn from "./two-column";
import HeaderSection from "./header/headerSection";
import FooterImage from "./footer/footerImage";
import FooterSitemap from "./footer/footerSitemap";
import { Items } from "@/types/itemListTypes";
import { Session } from "next-auth";

type Res = {
    items: Items[];
    totalPages: number;
};

type Props = {
    shopPage?: boolean;
    hasShop?: boolean;
    itemList: Res;
    session: Session | null;
    accessToken: string | null;
};

export default function Lp({ shopPage, hasShop, itemList, session, accessToken }: Props) {
    return (
        <>
        <HeaderSection shopPage={shopPage} session={session} />
        
        <Container>
            <TwoColumn shopPage={shopPage} itemList={itemList} session={session} accessToken={accessToken} />
        </Container>

        <FooterImage shopPage={shopPage} hasShop={hasShop} session={session} />
        <FooterSitemap />
        </>
    )
}