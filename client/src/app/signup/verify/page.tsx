import { Container } from "@/components";
import styles from "@/styles/login.module.css";
import { Suspense } from "react";
import { Resend } from "./resend";
import { VerifyForm } from "./verify-form";

export default function Page() {
    return (
        <Container>
            <h1 className={styles.title}>メール認証</h1>

            <section className={styles.card}>
                <VerifyForm />
                <Suspense fallback={<p>読み込み中...</p>}>
                    <Resend />
                </Suspense>
            </section>
        </Container>
    );
}
