import { TokuteiSection } from "@/components/tokutei";
import styles from "@/styles/tokutei.module.css";
import Link from "next/link";
import { SITE } from "../../config/site";

export const Content = () => {
    return (
        <>
            <TokuteiSection header="事業者名">
                <p>{SITE.companyName}</p>
            </TokuteiSection>

            <TokuteiSection header="代表者">
                <p>{SITE.representative}</p>
            </TokuteiSection>

            <TokuteiSection header="創業">
                <p>{SITE.createDate}</p>
            </TokuteiSection>

            <TokuteiSection header="所在地">
                <div className="flex flex-start">
                    <p className="break-all">{SITE.address}</p>
                </div>
            </TokuteiSection>

            <TokuteiSection header="事業内容">
                <p>WEBサービス・ECシステムの開発・運用</p>
            </TokuteiSection>

            <TokuteiSection header="電話番号">
                <p>{SITE.phone}</p>
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
                    {SITE.email}
                    <br />
                    {SITE.supportEmail}
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
                <p>{SITE.contactTime}</p>
            </TokuteiSection>

            <TokuteiSection header="URL">
                <p>
                    <Link href="/" className={styles.link}>
                        {SITE.appLink}
                    </Link>
                    （仮）
                </p>
            </TokuteiSection>

            <TokuteiSection header="取引銀行">
                <p>{SITE.bank}</p>
            </TokuteiSection>
        </>
    );
};
