import UrlText from "./urlText";
import { Item } from "../itemPageTypes";
import SaleButton from "./saleButton";
import UploadButton from "./uploadButton";

type Props = {
    id: string;
    item: Item;
    accessToken: string;
};

export default function SellerSectionTop({ id, item, accessToken }: Props) {
    return (
        <nav>
            <UrlText />
            <SaleButton item={item} accessToken={accessToken} />
            <UploadButton id={id} accessToken={accessToken} />
        </nav>
    );
};