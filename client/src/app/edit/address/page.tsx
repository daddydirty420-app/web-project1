import { Metadata } from "next";
import { fetchAddressPage } from "../api/address/server";
import { AddressEditForm } from "./addressEditForm";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "住所の設定・変更",
        description: "住所を設定・変更できます。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const data = await fetchAddressPage();

    return <AddressEditForm address={data.data} page="normal" />;
}
