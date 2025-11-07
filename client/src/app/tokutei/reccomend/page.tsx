import { TitleAndBack, Container, Header, Footer } from 'components'
import { TokuteiContainer, TokuteiSection } from 'components/tokutei'
import styles from 'styles/tokutei.module.css'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: "特定商取引法に基づく表記（FLEXレコメンド編） | FLEX OUTDOOR",
    description: "FLEX OUTDOORの特定商取引法に基づく表記はこちら！",
    robots: {
        index: false,
        follow: false
    }
}

export default function TokuteiReccomend() {
    return (
        <>
        <Header />

        <Container header>
            <TitleAndBack title='特定商取引法に基づく表記（FLEXレコメンド）' />

            <TokuteiContainer>
                <TokuteiSection header='販売事業者の名称'>
                    <p>代表者氏名：○○ ○○
                        <br />サービス名称：FLEX OUTDOOR
                    </p>
                </TokuteiSection>

                <TokuteiSection header='所在地'>
                    <div className='flex flex-start'>
                        <p className='break-all'>〒210-0007</p>
                        <p className='ml-[0.5rem] break-all'>神奈川県川崎市川崎区駅前本町11-2
                            <br />川崎フロンティアビル4階
                        </p>
                    </div>
                </TokuteiSection>

                <TokuteiSection header='電話番号'>
                    <p>請求があった場合、遅滞なく開示します。</p>
                    <small className='block mt-1 text-[var(--gray-50)]'>※現在、お電話による対応は原則行っておりません。お問い合わせの際は、<Link href='/inquiry' className='underline cursor-pointer'>お問い合わせフォーム</Link>からお問い合わせください。</small>
                </TokuteiSection>

                <TokuteiSection header='メールアドレス'>
                    <p>support@flex-outdoor-mail.com</p>
                </TokuteiSection>

                <TokuteiSection header='営業時間'>
                    <p>平日10～18時</p>
                </TokuteiSection>

                <TokuteiSection header='運営統括責任者'>
                    <p>○○ ○○</p>
                </TokuteiSection>

                <TokuteiSection header='URL'>
                    <p><Link href='/' className='cursor-pointer hover:underline'>https://flex-outdoor.com</Link></p>
                </TokuteiSection>

                <TokuteiSection header='支払い価格'>
                    <p>単品プラン：300円/1点</p>
                    <p>月額プラン：880円/月</p>
                    <small className='block mt-2 text-[var(--gray-50)]'>※キャンペーン等により料金が変動する場合がございます。</small>
                </TokuteiSection>

                <TokuteiSection header='支払い方法・支払い時期'>
                    <p>支払い方法：売上金差し引き</p>
                    <p>支払い時期：</p>
                    <div className={styles.innerContent}>
                        <p>・単品プラン：購入者が商品を受け取ったとき
                            <br />・月額プラン：毎月末
                        </p>
                    </div>
                </TokuteiSection>

                <TokuteiSection header='売上金額が料金に満たない場合'>
                    <div className='flex flex-start'>
                        <p>単品プラン：</p>
                        <p>販売手数料を除いた商品の売上金額がFLEXレコメンドの料金に満たない場合、売上金全額差し引きいたします。</p>
                    </div>
                    <div className='flex flex-start mt-2'>
                        <p>月額プラン：</p>
                        <p>当月の売上金額がFLEXレコメンドの料金に満たない場合、当月の売上金額から全額差し引きいたします。また、当月の売上金額が0円だった場合、料金を徴収いたしません。</p>
                    </div>
                </TokuteiSection>

                <TokuteiSection header='月額プランの自動更新・解約'>
                    <p>月額プランの方は、マイページの「FLEXレコメンド加入・変更」をクリックし、「解約する」を選択することで解約できます。なお、解約を申し込まない限り、毎月末のお支払い時に契約が自動更新されます。解約を申し込んだ月までは料金が通常通り発生し、月末までFLEXレコメンドの機能をご利用できます。</p>
                    <small className='block mt-2 text-[var(--gray-50)]'>※マイページの「FLEXレコメンド加入・変更」や「解約する」ボタンが表示されない場合は、お気軽にお問い合わせフォームからお問い合わせください。</small>
                </TokuteiSection>
            </TokuteiContainer>
        </Container>

        <Footer />
        </>
    )
}