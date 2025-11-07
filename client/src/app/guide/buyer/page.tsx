import { TitleAndBack, Container, Accordion, AccordionGrid, Header, Footer } from '@/components'
import { GuideSubTitle, GuideSmall, GuideSection } from '@/components/guide'
import { ListUl, ListFlow, ListFlowArrow, ListCheck, Nado } from '@/components/list'
import RowTextContainer from '@/components/two-text-container/tow-text-container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import styles from '@/styles/guide.module.css'
import clsx from 'clsx'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "ご利用ガイド - 購入者の方 | FLEX OUTDOOR",
    description: "FLEX OUTDOORの商品の閲覧から購入、取引、受け取りまで、わかりやすく解説しています。",
    robots: {
        index: false,
        follow: false
    }
}

export default function GuideBuyer() {
    return (
        <>
        <Header />

        <Container header>
            <TitleAndBack title='購入者の方' />

            <GuideSubTitle text='購入方法' />
            <AccordionGrid>
                <Accordion heading='購入方法'>
                    <p className={clsx('mt-4 mb-2', styles.PHeading)}>かんたん購入ガイド</p>

                    <ListUl>
                        <ListFlow number={1}>「<span className='text-blue-700'>購入する</span>」ボタンをクリック</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={2}>お届け先、氏名、配達時間を入力（商品によってはサイズ選択）</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={3}>支払い方法を選択</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={4}><span className='text-red-600'>購入完了</span>、<span className='text-blue-700'>購入した商品ページ</span>から配送状況を確認</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={5}>商品受け取り後、購入した商品ページの「<span className='text-blue-700'>受け取りました</span>」ボタンをクリックし、<span className='text-red-600'>出品者評価</span>を行う</ListFlow>
                    </ListUl>

                </Accordion>

                <Accordion heading='支払い方法'>
                    <p className='mt-4 mb-2'>支払い方法は以下の通りです。（今後、変更する可能性がございます）</p>

                    <ListUl>
                        <ListCheck>クレジットカード払い</ListCheck>
                        <ListCheck>ポイント払い</ListCheck>
                    </ListUl>

                    <p>クレジットカードとポイントは併用してお支払い可能です。</p>
                    <GuideSmall>例：3,000円の商品で、ポイント100pt・クレジット2,900円など</GuideSmall>

                    <GuideSmall>※ポイントは保有した日から180日後まで未使用である場合、無効になり弊社が回収いたします。</GuideSmall>
                </Accordion>

                <Accordion heading='購入価格について'>
                    <p className='mt-4 mb-2'>表示されている商品価格には以下の料金が含まれています。</p>

                    <ListUl>
                        <ListCheck>商品本体価格（消費税含む）</ListCheck>
                        <ListCheck>販売手数料</ListCheck>
                    </ListUl>

                    <p>購入者は表示されている額のお支払いとなります。</p>
                    <GuideSmall>※送料は出品者の支払いとなります。</GuideSmall>
                </Accordion>
            </AccordionGrid>

            <GuideSubTitle text='商品情報の閲覧' />
            <AccordionGrid>
                <Accordion heading='商品ページの内容'>
                    <p className='mt-4 mb-2'>商品ページに記載の内容は以下の通りです。</p>

                    <GuideSection heading='動画'>
                        <p className={styles.sectionChildP}>商品に関連する動画です。どなたでもご覧いただけます。<br />動画の概要やいいねボタンもあります。</p>
                    </GuideSection>
                    <GuideSection heading='出品者'>
                        <p className={styles.sectionChildP}>ユーザーネームなど出品者に関する情報や、フォローボタンなど。</p>
                    </GuideSection>
                    <GuideSection heading='商品'>
                        <p className={styles.sectionChildP}>商品ページには以下の内容が記載されています。</p>
                        <ListUl>
                            <ListCheck>価格</ListCheck>
                            <ListCheck>商品名</ListCheck>
                            <ListCheck>商品説明</ListCheck>
                            <ListCheck>商品の状態</ListCheck>
                            <ListCheck>配送情報</ListCheck>
                        </ListUl>
                        <Nado />
                    </GuideSection>
                    <GuideSection heading='関連する商品'>
                        <p className={styles.sectionChildP}>主に同じジャンルの人気の商品や、興味がありそうな商品のリンクを掲載しています。</p>
                    </GuideSection>
                    <GuideSection heading='コメント'>
                        <p className={styles.sectionChildP}>動画や商品に対するユーザーのコメントを閲覧できます。また、ご自身でコメントを投稿することができます（ログインユーザーのみ）。</p>
                    </GuideSection>

                    <p className='mt-4'>このほかにも様々な機能がございます。</p>
                </Accordion>

                <Accordion heading='動画・商品を閲覧できない'>
                    <p className='mt-4 mb-2'>動画・商品を閲覧できない場合、以下の方法を試し、ご確認ください。</p>
                    <ListUl>
                        <ListCheck>wi-fiを切って閲覧（携帯電話回線を使用する）</ListCheck>
                        <ListCheck>端末再起動</ListCheck>
                        <ListCheck>ご利用の端末OSを最新のものへ更新</ListCheck>
                        <ListCheck>シークレットモードで起動</ListCheck>
                        <ListCheck>別端末で見られるかどうかの確認</ListCheck>
                    </ListUl>

                </Accordion>

                <Accordion heading='動画のいいね・保存'>
                    <p className='mt-4 mt-2'>商品ページから、動画の下にある「<strong className='text-[var(--theme)]'>いいね</strong>」ボタンを押すと、マイページの「<span className='text-blue-700'>いいねした商品</span>」から閲覧できます。</p>
                </Accordion>

                <Accordion heading='報告する'>
                    <ListUl>
                        <ListFlow number={1}>
                            <FontAwesomeIcon icon={faFlag} className='text-[var(--theme)] text-base' />
                            「報告する」アイコンをクリック
                        </ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={2}>報告する理由を選択</ListFlow>
                    </ListUl>
                </Accordion>
            </AccordionGrid>

            <GuideSubTitle text='商品の購入、配送、受取' />
            <AccordionGrid>
                <Accordion heading='送料について'>
                    <p className='mt-4 mb-2'>送料は<strong className='text-red-600'>出品者の負担</strong>となります。購入者からは頂戴しておりません。</p>
                </Accordion>

                <Accordion heading='購入明細の表示方法'>
                    <p className='mt-4 mb-2'>購入明細の表示方法は以下の通りです。</p>

                    <ListUl>
                        <ListCheck>「お知らせ」から該当するお知らせをクリック</ListCheck>
                        <ListCheck>マイページまたはフッターの「購入した商品」をクリック</ListCheck>
                        <ListCheck>トップページの受取待ち商品からクリック</ListCheck>
                    </ListUl>

                </Accordion>

                <Accordion heading='配送状況について'>
                    <p className='mt-4 mb-2'>配送状況は、<strong className='text[var(--theme)]'>購入明細ページの上部</strong>に表示されます。</p>

                    <ListUl>
                        <ListCheck>発送待ち</ListCheck>
                        <ListCheck>配送中</ListCheck>
                        <ListCheck>受取済み</ListCheck>
                    </ListUl>

                    <p className={clsx('mt-4', styles.PHeading)}>配送状況は、以下により変化します。</p>
                    <div className='mt-2 ml-[1rem]'>
                        <RowTextContainer heading='発送待ち→配送中：'>出品者が配送会社と配送手続きを完了し、取引詳細ページの「<span className='text-blue-700'>発送しました</span>」ボタンを押したとき</RowTextContainer>
                        <RowTextContainer heading='配送中→受取済み：'>購入者が商品を受け取り、購入明細ページから「<strong className='text-[var(--theme)]'>受け取りました</strong>」ボタンを押し、出品者評価を終えたとき</RowTextContainer>
                    </div>

                    <p className='text-[var(--alart)] font-bold'>※出品者が「発送しました」ボタンを押さなかった場合、発送済みでも「発送待ち」と表示されることがありますが、配送には問題ありません。</p>
                    <p>商品が到着し次第、「<strong className='text-[var(--theme)]'>受け取りました</strong>」ボタンを押し、出品者評価を行ってください。</p>
                </Accordion>

                <Accordion heading='出品者評価について'>
                    <p className='mt-4 mb-4'>商品の受け取りが完了し、「<strong className='text-[var(--theme)]'>受け取りました</strong>」ボタンをクリックしたら、<span className='text-blue-700'>出品者評価</span>を行います。</p>

                    <p className={styles.PHeading}>主な評価基準</p>
                    <ListUl>
                        <ListCheck>商品説明の内容と相違が無いか</ListCheck>
                        <ListCheck>商品説明に記載されていない破損等が無いか</ListCheck>
                        <ListCheck>商品説明に記載の目安通り商品が届いたか</ListCheck>
                        <ListCheck>商品と関係のないものが入っていないか</ListCheck>
                        <ListCheck>規約違反のものが入っていないか</ListCheck>
                    </ListUl>
                    <Nado />

                    <p className='mt-2'>出品者評価は「<span className='text-blue-700'>良かった</span>」「<span className='text-[var(--alert)]'>悪かった</span>」で選択できます。<br />取引に問題が無ければ「<span className='text-blue-700'>良かった</span>」を選んでください。</p>
                    <GuideSmall>※出品者評価を終えることにより、取引が完了したものとします。出品者への売上金の入金も同時に行われるため、必ず出品者評価をお願いします。</GuideSmall>

                </Accordion>

                <Accordion heading='返金、返品、保証について'>
                    <p className='mt-4 mb-2 font-bold text-[var(--alert)]'>弊社では返金、返品、保証等の対応は致しておりません。</p>

                    <p>商品の受け取り後、出品者とチャットでご相談のうえ、出品者のもとにご返品いただくことは可能です。</p>
                    <GuideSmall>※返品の際は、必ず出品者が希望する住所または発送元の住所へご返品ください。弊社に送付されましても対応いたしかねます。</GuideSmall>
                </Accordion>

                <Accordion heading='キャンセルについて'>
                    <p className='mt-4 mb-2 font-bold text-[var(--alert)]'>※商品の発送後はキャンセルできません。</p>
                    <p className='mt-4 mb-2 font-bold text-[var(--alert)]'>※キャンセルした場合、支払額の10%のキャンセル料を徴収いたします。<br />キャンセル料は購入者負担となります。</p>

                    <p>商品の発送前であれば、購入明細ページからキャンセル申請可能です。出品者がキャンセル申請を承認すれば、キャンセルが成立します。</p>
                    
                    <p className='mt-2'>キャンセル後の返金方法は以下から選べます。</p>
                    <ListUl>
                        <ListCheck>銀行振込</ListCheck>
                        <ListCheck>ポイント変換</ListCheck>
                    </ListUl>

                    <GuideSmall className='mt-4'>
                        銀行振込の場合、口座情報を登録し（口座情報未登録の方のみ）、キャンセル料（商品代金の10%）と振込手数料（200円）を差し引いた金額を、キャンセル成立時の翌月10日（金融機関が休業日の場合、その翌営業日）にお振込みいたします。
                        <br />ポイント変換の場合、キャンセル料を差し引いた額を即時ポイントに変換いたします。
                    </GuideSmall>
                </Accordion>

                <Accordion heading='商品が届かない'>
                    <p className='mt-4 mb-4 font-bold'>商品の発送前であればキャンセル可能です。</p>
                    <p className='font-bold'>※キャンセルした場合、支払額の10%のキャンセル料を徴収いたします。<br />キャンセル料は購入者負担となります。</p>

                    <p className='mt-6 mb-2 font-bold text-[var(--alert)]'>※発送前でも、キャンセルせず購入から30日経過した場合、取引が完了したとみなします。この場合、返金等は一切いたしません。</p>
                    <p className='mb-4'>商品が発送されない場合、必ず購入から<strong className='text-[var(--theme)]'>30日以内</strong>にキャンセル手続きを完了してください。</p>

                    <GuideSmall>※キャンセル申請が承認されず、商品が30日経過後も発送されない場合、<Link href='/inquiry' className='hover:underline text-blue-600 hover:text-blue-800'>お問い合わせフォーム</Link>からお問い合わせください。</GuideSmall>
                </Accordion>
            </AccordionGrid>
        </Container>

        <Footer />
        </>
    )
}