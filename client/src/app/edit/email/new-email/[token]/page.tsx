import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import FetchClient from "./fetch";

type Props = {
    params: { token: string };
};

export default async function Page({ params }: Props) {
    const { token } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !user) {
        notFound();
    }

    return (
        <FetchClient
        session={session}
        token={token}
        />
    );
};