import { Container } from "components";
import VerifyForm from './verify-form';
import Resend from "./resend";
import { Metadata } from "next";
import styles from 'styles/login.module.css'

export const metadata: Metadata = {
    title: "メール認証 | FLEX OUTDOOR",
    description: "認証コード",
    robots: {
        index: false,
        follow: false
    }
}

export default function Verify() {
    return (
        <Container>
            <h1 className={styles.title}>メール認証</h1>

            <section className={styles.card}>
                <VerifyForm />
                <Resend />
            </section>
        </Container>
    )
}