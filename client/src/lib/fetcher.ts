export const fetcher = <T>(accessToken?: string) => async (url: string): Promise<T> => {
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
        },
    });
    if (!res.ok) throw new Error("Fetch failed!!");
    return res.json() as Promise<T>;
}