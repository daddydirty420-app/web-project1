import { Container } from "@/components";
import styles from "@/styles/login.module.css";
import { Metadata } from "next";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = {
    title: "パスワードリセット",
    description: "パスワードリセット",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return (
        <Container>
            <h1 className={styles.title}>パスワードリセット</h1>

            <section className={styles.card}>
                <ResetForm />
            </section>
        </Container>
    );
}
