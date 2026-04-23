import { TokuteiSection } from "@/components/tokutei";
import styles from "@/styles/tokutei.module.css";
import Link from "next/link";

export const Content = () => {
    return (
        <>
            <TokuteiSection header="事業者名">
                <p>○○</p>
            </TokuteiSection>

            <TokuteiSection header="代表者">
                <p>○○ ○○</p>
            </TokuteiSection>

            <TokuteiSection header="創業">
                <p>2026年○○月○○日</p>
            </TokuteiSection>

            <TokuteiSection header="所在地">
                <div className="flex flex-start">
                    <p className="break-all">〒210-0007</p>
                    <p className="ml-[0.5rem] break-all">
                        神奈川県川崎市川崎区駅前本町11-2
                        <br />
                        川崎フロンティアビル4階
                    </p>
                </div>
            </TokuteiSection>

            <TokuteiSection header="事業内容">
                <p>WEBサービス・ECシステムの製作・運用</p>
            </TokuteiSection>

            <TokuteiSection header="電話番号">
                <p>請求があった場合、遅滞なく開示します。</p>
                <small className={styles.small}>
                    ※現在、お電話による対応は原則行っておりません。お問い合わせの際は、
                    <Link href="/inquiry" className="underline cursor-pointer">
                        お問い合わせフォーム
                    </Link>
                    からお問い合わせください。
                </small>
            </TokuteiSection>

            <TokuteiSection header="メールアドレス">
                <p>
                    contact@○○.com
                    <br />
                    support@○○.com
                </p>
                <small className={styles.small}>
                    ※現在、お電話による対応は原則行っておりません。お問い合わせの際は、
                    <Link href="/inquiry" className="underline cursor-pointer">
                        お問い合わせフォーム
                    </Link>
                    および上記のメールからお問い合わせください。
                </small>
            </TokuteiSection>

            <TokuteiSection header="営業時間">
                <p>平日10～18時（お盆、年末年始期間を除く）</p>
            </TokuteiSection>

            <TokuteiSection header="URL">
                <p>
                    <Link href="/" className={styles.link}>
                        https://○○.com
                    </Link>
                    （仮）
                </p>
            </TokuteiSection>

            <TokuteiSection header="取引銀行">
                <p>○○銀行</p>
            </TokuteiSection>
        </>
    );
};
