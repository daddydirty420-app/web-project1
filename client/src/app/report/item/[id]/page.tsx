import { Metadata } from "next";
import { fetchItemReportPage } from "../../api/server";
import { Form } from "../../form";
import ReportUI from "../../reportUI";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "報告する",
        description: "利用規約違反や不愉快なコンテンツ等を報告できます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const data = await fetchItemReportPage();

    return (
        <ReportUI title="報告">
            <Form id={id} options={data.options} page="item" />
        </ReportUI>
    );
}
