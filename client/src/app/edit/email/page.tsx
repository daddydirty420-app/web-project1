import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchRefreshToken } from "@/lib/refreshToken";
import EmailEditForm from "./emailEditForm";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "メールアドレスの設定・変更 | FLEX OUTDOOR",
        description: "メールアドレスを設定・変更できます。ボタンをクリックすると、新しいメールアドレスに本登録URLを記載したメールを送信いたします。こちらのページでメールアドレスの変更が完了するわけではございません。",
        robots: {
            index: false,
            follow: false,
        },
    };
};

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
        try {
            const newAccessToken = await fetchRefreshToken();
            if (session) {
                session.accessToken = newAccessToken;
            }
        } catch (err) {
            console.log(err);
            notFound();
        }
    }

    return (
        <EmailEditForm
        session={session}
        />
    );
};