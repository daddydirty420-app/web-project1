import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Form } from "../../form";
import ReportUI from "../../reportUI";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "報告する",
        description: "利用規約違反や不愉快なコメント等を報告できます。",
        robots: {
            index: false,
            follow: false
        }
    };
};

export default async function Page({ params }: Props) {
    const { id } = await params;
            
    const session = await getServerSession(authOptions);
    
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;
    
    if (!session || !accessToken) redirect("/login");

    const res = await fetch(`${process.env.API_URL}/comment-report/all-options`);

    if (!res.ok) {
        notFound();
    }

    const data = await res.json();

    return (
        <ReportUI title="報告">
            <Form
            id={id}
            options={data.options}
            page="comment"
            />
        </ReportUI>
    );
}