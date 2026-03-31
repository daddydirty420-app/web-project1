import { Container } from "@/components";
import styles from "@/styles/emailComplete.module.css";
import Link from "next/link";

export default function Element() {
    return (
        <Container>
            <h1 className={styles.title}>事業形態変更の申請が完了しました</h1>

            <p className={styles.content}>事業形態変更のお申込みが完了しました。
                <br />審査完了後にメールにて改めて事業形態の変更をお知らせいたします。なお、審査には1～2週間ほどお時間を頂戴しております。ご迷惑をお掛けしますが、ご協力お願いいたします。
            </p>

            <p className={styles.content}>ご不明な点などありましたらお気軽に
                <Link href="/inquiry" className={styles.linkText}>お問い合わせフォーム</Link>
                からお問い合わせください。
            </p>

            <Link href="/my-page" className={styles.linkButton}>
            マイページへ戻る
            </Link>
        </Container>
    );
};