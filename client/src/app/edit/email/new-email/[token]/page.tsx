import { FetchClient } from "./fetch";

type Props = {
    params: { token: string };
};

export default async function Page({ params }: Props) {
    const { token } = await params;

    return (
        <FetchClient
        token={token}
        />
    );
};