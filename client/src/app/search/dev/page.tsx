import { SearchItemList } from "../itemList";
import SearchUI from "../searchUI";

export default async function Page() {
    return (
        <SearchUI>
            <SearchItemList />
        </SearchUI>
    );
}
