import { Metadata } from "next";
import { fetchPointsPage } from "../api/server";
import { Form } from "./form";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "ポイント変換",
        description: "売上金をポイントに変換できます。ポイントの有効期限は、変換日から180日後になります。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const data = await fetchPointsPage();

    return <Form user={data.user} />;
}
