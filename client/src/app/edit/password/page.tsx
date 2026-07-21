import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SITE } from "../../../config/site";
import { authOptions } from "../../../lib/auth";
import { PasswordEditForm } from "./passwordEdit";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "パスワード変更",
        description: `「${SITE.appName}」のパスワードを設定・変更できます。（現在のパスワードをお忘れの方はログインフォームからパスワード忘れの手続きを行ってください。）`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken || !session) redirect("/login");

    return <PasswordEditForm />;
}
