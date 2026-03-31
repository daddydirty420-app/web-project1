import { Container } from "@/components";
import { PwForm } from '../pw-form';
import { Metadata } from "next";
import styles from '@/styles/login.module.css';

export const metadata: Metadata = {
    title: "新しいパスワード",
    description: "新しいパスワードの設定",
    robots: {
        index: false,
        follow: false
    }
};

export default function Page() {
    return (
        <Container>
            <h1 className={styles.title}>新しいパスワード</h1>

            <section className={styles.card}>
                <PwForm />
            </section>
        </Container>
    );
}