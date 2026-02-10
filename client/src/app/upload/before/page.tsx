import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Client } from "./client";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "出品する",
        description: "新しく商品を出品、もしくは下書き一覧から出品する商品をお選びください。",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) redirect("/login");

    return <Client />;
};