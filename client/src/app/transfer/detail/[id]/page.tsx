import { Metadata } from "next";
import { fetchDetailPage } from "../../api/server";
import { TransferDetail } from "../detail";
import DetailContainer from "../detailContainer";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "振込申請詳細",
        description: "お振込金額やお振込口座、振込状況など、振込申請の詳細情報をご覧いただけます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const data = await fetchDetailPage(id);

    const transfer = data.transfer;

    return (
        <DetailContainer>
            <TransferDetail transfer={transfer} />
        </DetailContainer>
    );
}
