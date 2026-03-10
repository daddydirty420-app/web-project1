import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Form } from "./form";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "ポイント変換",
        description: "売上金をポイントに変換できます。ポイントの有効期限は、変換日から180日後になります。",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page() {
    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!session || !accessToken) redirect("/login")

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/transfar-points`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data.messaage);
        notFound();
    }

    return (
        <Form
        user={data.user}
        />
    );
};