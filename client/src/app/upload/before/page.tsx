import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Client } from "./client";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "出品する",
        description: "新しく商品を出品、もしくは下書き一覧から出品する商品をお選びください。",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    return <Client />;
}
