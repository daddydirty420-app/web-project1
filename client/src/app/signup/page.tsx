import { Container } from "@/components";
import SignupForm from './signup-form';
import { Metadata } from "next";
import styles from '@/styles/login.module.css'

export const metadata: Metadata = {
    title: "会員登録 | FLEX OUTDOOR",
    description: "FLEX OUTDOORの会員登録はこちら！",
    robots: {
        index: false,
        follow: false
    }
}

export default function Signup() {
    return (
        <Container>
            <h1 className={styles.title}>会員登録</h1>

            <section className={styles.card}>
                <SignupForm />
            </section>
        </Container>
    )
}