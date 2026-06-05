import { Metadata } from "next";
import { SearchItemList } from "./itemList";
import SearchUI from "./searchUI";

type Props = {
    searchParams: string;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    return {
        title: "検索結果",
        description: `${searchParams}の検索結果`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ searchParams }: Props) {
    return (
        <SearchUI>
            <SearchItemList keyword={searchParams} />
        </SearchUI>
    );
}
