import { Metadata } from "next";
import { cookies } from "next/headers";
import { Form } from "./form";
import InquiryUI from "./inquiryUI";
import { LinkElement } from "./linkElement";
import { User } from "./type";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "お問い合わせ",
        description:
            "〇〇のご利用に関することや取引に関すること、お困りごとなどお気軽にお問い合わせください。（お問い合わせの返答可能時間：平日10時～18時）",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    let user: User | undefined = undefined;

    if (accessToken) {
        const res = await fetch(`${process.env.API_URL}/inquiry/user`, {
            method: "GET",
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await res.json();
        user = data.user;
    }

    return (
        <InquiryUI title="お問い合わせ">
            <LinkElement />
            <Form user={user ?? undefined} loggedIn={!!accessToken} />
        </InquiryUI>
    );
}
