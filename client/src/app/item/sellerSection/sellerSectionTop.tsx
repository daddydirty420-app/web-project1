import UrlText from "./urlText";
import { Item } from "../itemPageTypes";
import SaleButton from "./saleButton";
import UploadButton from "./uploadButton";
import { Session } from "next-auth";

type Props = {
    id: string;
    item: Item;
    session: Session | null;
};

export default function SellerSectionTop({ id, item, session }: Props) {
    return (
        <nav>
            <UrlText />
            <SaleButton item={item} session={session} />
            <UploadButton id={id} session={session} />
        </nav>
    );
};