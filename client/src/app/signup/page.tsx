import { Container } from "@/components";
import styles from "@/styles/login.module.css";
import { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
    title: "会員登録",
    description: "会員登録はこちら！",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return (
        <Container>
            <h1 className={styles.title}>会員登録</h1>

            <section className={styles.card}>
                <SignupForm />
            </section>
        </Container>
    );
}
