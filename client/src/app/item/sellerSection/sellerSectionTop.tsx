import UrlText from "./urlText";
import { Item } from "../itemPageTypes";
import SaleButton from "./saleButton";
import UploadButton from "./uploadButton";

type Props = {
    id: string;
    item: Item;
};

export default function SellerSectionTop({ id, item }: Props) {
    return (
        <nav>
            <UrlText />
            <SaleButton item={item} />
            <UploadButton id={id} />
        </nav>
    );
};