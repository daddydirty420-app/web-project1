import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SITE } from "../../config/site";
import { fetchMyPage } from "./api/server";
import { CookieSet } from "./cookieSet";
import { MypageElement } from "./mypageElement";

export const metadata: Metadata = {
    title: "マイページ",
    description: `${SITE.appName}のマイページはこちら！ご自身のアカウントに関する情報を閲覧できます。ログインユーザーのみ！`,
    robots: {
        index: false,
        follow: false,
    },
};

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    const data = await fetchMyPage();

    const profileLink = `/profile/${session?.user?.id ?? ""}`;

    return (
        <>
            <CookieSet refreshToken={session?.user.refreshToken} rememberMe={session?.user.rememberMe} />

            <MypageElement data={data} user={data.userData.user} profileLink={profileLink} />
        </>
    );
}
