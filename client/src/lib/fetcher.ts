import { refreshToken } from "./refreshToken";

export const fetcher = async <T>(url: string): Promise<T> => {
    const accessToken = await refreshToken();
    
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken ?? ""}`,
        },
    });
    if (!res.ok) throw new Error("Fetch failed!!");
    return res.json() as Promise<T>;
}