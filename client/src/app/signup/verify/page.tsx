import { Container } from '@/components';
import { VerifyForm } from './verify-form';
import { Resend } from './resend';
import styles from '@/styles/login.module.css';

export default function Page() {
    return (
        <Container>
            <h1 className={styles.title}>メール認証</h1>

            <section className={styles.card}>
                <VerifyForm />
                <Resend />
            </section>
        </Container>
    );
}
