"use client";

import { useEffect } from "react";

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: Props) {
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.error(error);
        }
    }, [error]);

    return (
        <div>
            <h2>エラーが発生しました</h2>
            <button onClick={() => reset()}>もう一度試す</button>
        </div>
    );
}
