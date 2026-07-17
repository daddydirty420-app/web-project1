import { TitleAndBack } from "@/components";
import { TokuteiContainer, TokuteiSection } from "@/components/tokutei";
import styles from "@/styles/tokutei.module.css";
import Link from "next/link";

export const Content = () => {
    return (
        <>
            <TitleAndBack title="特定商取引法に基づく表記" />

            <TokuteiContainer>
                <TokuteiSection header="販売事業者の名称">
                    <p>
                        代表者氏名：○○ ○○
                        <br />
                        サービス名称：〇〇〇〇
                    </p>
                </TokuteiSection>

                <TokuteiSection header="所在地">
                    <div className="flex flex-start">
                        <p className="break-all">〒210-0007</p>
                        <p className="ml-2 break-all">
                            神奈川県川崎市川崎区駅前本町11-2
                            <br />
                            川崎フロンティアビル4階
                        </p>
                    </div>
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
                    <p>support@○○.com</p>
                </TokuteiSection>

                <TokuteiSection header="営業時間">
                    <p>平日10～18時（お盆、年末年始期間を除く）</p>
                </TokuteiSection>

                <TokuteiSection header="運営統括責任者">
                    <p>○○ ○○</p>
                </TokuteiSection>

                <TokuteiSection header="URL">
                    <p>
                        <Link href="/" className={styles.link}>
                            https://fuckintesting.com
                        </Link>
                    </p>
                </TokuteiSection>

                <TokuteiSection header="支払い価格">
                    <p>
                        各商品の表示価格に準ずる。（すべての商品の表示価格に本体価格、消費税、手数料、配送料を含んだ価格を表示しております）
                    </p>
                </TokuteiSection>

                <TokuteiSection header="支払い方法・支払い時期">
                    <div className={styles.twoTextFlex}>
                        <p>支払い方法：</p>
                        <div className={styles.innerContent}>
                            <p>
                                ・クレジットカード決済
                                <br />
                                ・ポイント決済
                            </p>
                        </div>
                    </div>
                    <div className={styles.twoTextFlex}>
                        <p>支払い時期：</p>
                        <div className={styles.innerContent}>
                            <p>
                                ・クレジットカード：商品注文時にお支払いが確定します。お支払い時期は各クレジットカード会社によるものとします。
                                <br />
                                ・ポイント：商品注文時にお支払いが完了します。
                            </p>
                        </div>
                    </div>
                </TokuteiSection>

                <TokuteiSection header="引き渡し時期">
                    <p>
                        注文から7日以内に発送するものとします。商品発送時にお客様へ通知し、到着時期は発送後に各配送会社へお問い合わせください。受け取り後はお客様が「受け取りました」ボタンを押し弊社へ通知するものとし、注文から30日以内に受取通知が無かった場合、商品を受け取ったものとします。
                    </p>
                </TokuteiSection>

                <TokuteiSection header="キャンセル・返品">
                    <div className={styles.twoTextFlex}>
                        <p>キャンセル：</p>
                        <p className={styles.innerContent}>
                            商品の発送前であれば、キャンセル可能です。その際、キャンセル料10%を頂戴いたします。返金額は口座振込、ポイント変換のどちらか選択できます。なお、商品や都合によりキャンセルできない場合があるので、一度チャットでご相談ください。
                        </p>
                    </div>
                    <div className={styles.twoTextFlex}>
                        <p>返品：</p>
                        <div className={styles.innerContent}>
                            <p>お客様都合により返品される場合：</p>
                            <p className="ml-2">原則、お客様都合での返品は受け付けておりません。</p>
                            <p>商品の不備により返品される場合：</p>
                            <p className="ml-2">
                                チャットにてご相談のうえ、ご自身で対応できない場合は返品を申し出ることが可能です。商品や都合により返品できない場合がございますので一度チャットにてご相談ください。なお、弊社の故意または過失により商品に不備が発生した場合、弊社からお客様の口座または当サイトのポイントにて全額返金いたします。弊社の故意または過失による商品の不備がある場合、お問い合わせフォームからご連絡ください。
                            </p>
                        </div>
                    </div>
                </TokuteiSection>
            </TokuteiContainer>
        </>
    );
};
