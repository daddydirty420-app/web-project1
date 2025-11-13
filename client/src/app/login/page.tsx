import { Container } from "@/components";
import LoginForm from './login-form';
import Link from "next/link";
import styles from '@/styles/login.module.css';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ログイン | FLEX OUTDOOR",
    description: "FLEX OUTDOORのログインはこちら！",
    robots: {
        index: false,
        follow: false
    }
}

export default function Login() {
    return (
        <Container>
            <h1 className={styles.title}>ログイン</h1>

            <section className={styles.card}>
                <LoginForm />

                <Link href='signup' className={styles.white}>新規会員登録（無料）</Link>
                
                <Link href='/login/reset-pw-mail' className={styles.reset}>パスワードを忘れた方</Link>
            </section>
        </Container>
    )
}