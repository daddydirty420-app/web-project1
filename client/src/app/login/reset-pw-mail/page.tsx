import { Container } from "components";
import ResetForm from './reset-form';
import { Metadata } from "next";
import styles from 'styles/login.module.css'

export const metadata: Metadata = {
    title: "パスワードリセット | FLEX OUTDOOR",
    description: "パスワードリセット",
    robots: {
        index: false,
        follow: false
    }
}

export default function PasswordReset() {
    return (
        <Container>
            <h1 className={styles.title}>パスワードリセット</h1>

            <section className={styles.card}>
                <ResetForm />
            </section>
        </Container>
    )
}