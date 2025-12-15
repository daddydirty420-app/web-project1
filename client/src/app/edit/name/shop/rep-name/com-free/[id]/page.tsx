import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import NameEditForm from "../../../../nameEditForm";
import { cookies } from "next/headers";

type Props = {
    params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "代表者氏名の設定・変更",
        description: "代表者氏名の変更ができます。",
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-com-free/rep-name/${id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data.message);
        notFound();
    }

    return (
        <NameEditForm
        name={data.data.Name}
        page="rep-com-free"
        shopEditId={id}
        />
    );
};