"use client";

import styles from "./seller.module.css";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

type Props = {
    id: string;
    session: Session | null;
};

export default function UploadButton({ id, session }: Props) {
    const router = useRouter();

    const copy = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/copy-upload/${id}`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${session?.accessToken ?? ""}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                const newItemId = data.newItemId;
                const url = `/upload/copy/${newItemId}`;
                router.push(url);
            } else {
                const errorData = await res.json();
                console.error(errorData.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.buttonDiv}>
            <button type="button" className={styles.blackButton} onClick={copy}>コピー出品</button>
            <Link href={`/upload/edit/${id}`} className={clsx(styles.blackButton, styles.edit)}>商品を編集する</Link>
        </div>
    );
};