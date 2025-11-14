import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchRefreshToken } from "@/lib/refreshToken";
import FetchClient from "./fetch";

type Props = {
    params: { token: string };
};

export default async function Page({ params }: Props) {
    const { token } = await params;
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
        <FetchClient
        session={session}
        token={token}
        />
    );
};