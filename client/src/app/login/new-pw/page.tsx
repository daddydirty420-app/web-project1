import { Container } from "@/components";
import styles from "@/styles/login.module.css";
import { Metadata } from "next";
import { Suspense } from "react";
import { PwForm } from "./pw-form";

export const metadata: Metadata = {
    title: "新しいパスワード",
    description: "新しいパスワードの設定",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return (
        <Container>
            <h1 className={styles.title}>新しいパスワード</h1>

            <section className={styles.card}>
                <Suspense fallback={<p>読み込み中...</p>}>
                    <PwForm />
                </Suspense>
            </section>
        </Container>
    );
}
