import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Form } from "./form";
import { fetchTransferRequest } from "../api/request";
import { fetchRequestPage } from "../api/server";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "振込申請",
        description:
            "売上金をユーザーが指定する口座へお振込みするための申請です。ご申請いただいた売上金のお振込みは、申請日の翌々週金曜日以降となります。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const data = await fetchRequestPage();

    return <Form user={data.user} />;
}
