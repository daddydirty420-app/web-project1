import { getAccessToken } from "./getAccessToken";

export const fetcher = async <T>(url: string): Promise<T> => {
    const accessToken = await getAccessToken();
    
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
        },
    });
    if (!res.ok) throw new Error("Fetch failed!!");
    return res.json() as Promise<T>;
}