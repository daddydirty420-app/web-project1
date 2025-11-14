import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function fetchRefreshToken() {
    const session = await getServerSession(authOptions);

    if (!session?.refreshToken) {
        throw new Error("refreshTokenがありません。");
    }

    try {
        const res = await axios.post(`
            ${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${session.refreshToken}`,
                },
            },
        );

        if (res.status === 200 && res.data.accessToken) {
            return res.data.accessToken
        } else {
            throw new Error("refreshToken更新失敗");
        }
    } catch (err) {
        console.error("refreshToken fetch error:", err);
        throw err
    }
};