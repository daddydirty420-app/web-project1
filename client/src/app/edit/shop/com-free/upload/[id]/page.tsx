import { Metadata } from "next";
import { redirect } from "next/navigation";
import Client from "../client";
import { cookies } from "next/headers";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "代表者身分証・許認可証登録",
        description: "事業形態を変更に伴い、代表者の身分証と、必要に応じて許認可証をアップロードし、提出していただく必要があります。（事業形態の変更には審査が必要になります。）",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page({ params }: Props) {
    const { id } = await params;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) redirect("/login");

    return (
        <Client
        shopEditId={id}
        />
    );
};