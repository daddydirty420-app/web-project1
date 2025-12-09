import { TitleAndBack, Container, Accordion, AccordionGrid } from '@/components';
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { GuideSubTitle, GuideSmall, GuideSection } from '@/components/guide';
import { ListUl, ListFlow, ListFlowArrow, ListCheck } from '@/components/list';
import styles from '@/styles/guide.module.css';
import clsx from 'clsx';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "ご利用ガイド - ショップガイド",
    description: "「〇〇」の限定機能や登録方法についてわかりやすく解説しています。",
    robots: {
        index: false,
        follow: false,
    }
};

export default function GuideShop() {
    return (
        <>
            <Header />

            <Container header>
                <TitleAndBack title='ショップガイド' />

                <p className={clsx('mb-2', styles.sectionChildP)}>※出品、売上金、振込申請については、「<Link href='seller' className='text-blue-600 hover:text-blue-800 hover:cursor-pointer'>ガイド-出品者の方</Link>」をご覧ください。</p>

                <GuideSubTitle text='ショップ登録' />
                <AccordionGrid>
                    <Accordion heading='ショップ登録方法'>
                        <ListUl>
                            <ListFlow number={1}>マイページから「<strong className='text-[var(--theme)]'>ショップ登録</strong>」をクリック</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={2}>事業区分（法人、個人事業主）を選択</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={3}>会社情報（事業者情報）を登録</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={4}>口座情報を登録</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={5}>
                                代表者身分証を入力<br />
                                <small className='text-gray-500'>顔写真付き身分証、表裏両面入力
                                   <br />例：運転免許証、マイナンバーカード、パスポートなど</small>
                                    <p className={styles.sectionChildP}>※許認可が必要な業種の場合、許認可証の登録</p>
                                    <small className='text-gray-500'>中古品（古物）、自家製の食品、冷凍食品など
                                        <br />※販売を禁止している商品を除く
                                    </small>
                            </ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={6}>オプションを選択</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={7}>ショップ登録お申し込み完了、審査開始（1~2週間ほど頂戴いたしております）</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={8}>審査完了、メールが届いたらショップ登録完了です！</ListFlow>
                        </ListUl>
                    </Accordion>

                    <Accordion heading='ショップ登録条件'>
                        <p className='mt-4'><strong className='text-[var(--theme)]'>ショップ登録</strong>には、以下の条件を満たしている必要があります。</p>

                        <ListUl>
                            <ListCheck>法人または個人事業主の方</ListCheck>
                            <ListCheck>認許可が必要な場合、所定の認許可を取得している方</ListCheck>
                            <ListCheck>FLEX OUTDOORと関連のある商品を販売される方</ListCheck>
                            <ListCheck>利用規約等に反しない方</ListCheck>
                        </ListUl>
                    </Accordion>

                    <Accordion heading='オプションについて'>
                        <p className='mt-4'>Shop登録時に、以下のオプションの選択ができます。</p>
                        <GuideSection heading='自動振込'>毎月10日に、前月分の売上金を自動的にお振込みいたします。これにより、振込申請の手間が省ける、申請し忘れが無くなるといったメリットがあります。（金融機関が休業日の場合、その翌営業日）</GuideSection>
                        <GuideSection heading='運営者情報を公開する'>プロフィールのショップ情報に、ショップ登録時にご入力いただいた会社情報（事業者情報）が公開されます。</GuideSection>

                        <GuideSection heading='レコメンド機能（有料）'>
                            <p className='font-bold mt-4'>〇〇レコメンド（月額880円）</p>
                            <div className='mt-2 ml-[0.5rem]'>
                                <p className={styles.sectionChildP}>トップページのおすすめおすすめ商品一覧に表示されます。また、商品ページおよび検索ページにも、「おすすめ商品」と記載されます。</p>
                                <GuideSmall>※商品が利用規約に違反する、または違反している可能性のある商品は、「おすすめ商品」から除外されます。</GuideSmall>
                                <GuideSmall>※レコメンドを申し込んでいないユーザーの商品も、ごくまれに「おすすめ商品」になることがあります。</GuideSmall>
                                <GuideSmall>※ショップ会員ではない通常会員も利用可能</GuideSmall>
                                <GuideSmall>※商品単品での申込み可能！（1点300円）</GuideSmall>
                            </div>
                        </GuideSection>
                    </Accordion>
                </AccordionGrid>

                <GuideSubTitle text='ショップについて' />
                <AccordionGrid>
                    <Accordion heading='〇〇ショップとは'>
                        <p className='mt-4 mb-2'><strong className='text-[var(--theme)]'>FLEX Shop</strong>とは、<strong>法人、個人事業主向け</strong>のショップ運用サービスです。通常の〇〇と使い勝手は同じですが、内容は異なり、一つの商品につき<strong>複数点出品</strong>や専用の<strong>在庫管理システム</strong>、毎月の<strong>自動振込</strong>など、事業者にとってうれしい機能が盛りだくさんのサービスです！</p>
                    </Accordion>

                    <Accordion heading='在庫登録について'>
                        <p className='mt-4 mb-2'><strong className='text-[var(--theme)]'>FLEX Shop</strong>ユーザー様に限り、一つの商品につき複数点出品できます</p>

                        <p className={styles.PHeading}>新しい在庫を入荷したとき</p>
                        <ListUl>
                            <ListFlow number={1}>商品ページを開く</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={2}>商品ページの一番下までスクロールし、「<span className='text-blue-700'>商品の内容を変更する</span>」をクリック、商品編集ページを開く</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={3}>「個数」に新しい在庫数を入力</ListFlow>
                        </ListUl>

                        <p className={styles.PHeading}>カラー・サイズ等種類が複数ある場合</p>
                        <ListUl>
                            <ListFlow number={1}>商品ページ一番下から、商品編集ページを開く</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={2}>「個数」に総在庫数を入力</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={3}>「次へ」をクリック</ListFlow>
                            <ListFlowArrow />
                            <ListFlow number={4}>カラー・サイズ等選択「はい」を選び、それぞれの在庫数を入力</ListFlow>
                        </ListUl>
                    </Accordion>

                    <Accordion heading='カラー、サイズ等種類の選択'>
                        <p className='mt-4 mb-2'>ショップユーザーで、複数点出品した商品に限り、カラー・サイズ等種類の選択ができます。</p>

                        <p className='font-bold'>出品ページの「個数」を2点以上にすると、「次へ」をクリックすると「カラー・サイズ等選択ページ」へ進みます。</p>
                        <ListUl>
                            <ListCheck>カラー：赤・黒、レッド・ブラックなど、正式な色の名前をご入力ください。</ListCheck>
                            <ListCheck>サイズ：服のサイズ S,M,L、靴のサイズ 25.0cm,25,5cm など</ListCheck>
                            <ListCheck>種類：メンズ・レディース、3点セット・4点セットなど</ListCheck>
                        </ListUl>

                        <GuideSmall>※カラー・サイズ・種類をすべて入力する必要はありません。空欄でも構いません。</GuideSmall>
                        <GuideSmall>※すべての種類に在庫数をご入力ください。</GuideSmall>
                        <GuideSmall>※カラー、サイズなどはご自身でご入力ください。</GuideSmall>
                    </Accordion>

                    <Accordion heading='売上データの閲覧'>
                        <p className='mt-4'>マイページもしくは商品ページから売上データにアクセスできます。</p>

                        <p className={clsx('mt-4 mb-2', styles.PHeading)}>ショップの売上</p>
                        <ListUl>
                            <ListCheck>日別売上推移</ListCheck>
                            <ListCheck>月別売上推移</ListCheck>
                        </ListUl>

                        <p className={clsx('mt-4 mb-2', styles.PHeading)}>商品の売上</p>
                        <ListUl>
                            <ListCheck>日別売上推移</ListCheck>
                            <ListCheck>日別販売個数推移</ListCheck>
                            <ListCheck>月別売上推移</ListCheck>
                        </ListUl>
                    </Accordion>

                    <Accordion heading='ショップ情報の閲覧'>
                        <p className={clsx('mt-4 mb-2', styles.PHeading)}>ショップ情報はショップの「特定商取引法に基づく表示」の機能を兼ねております。</p>

                        <GuideSection heading='ショップ情報の表示方法'>
                            <p className={styles.sectionChildP}><strong>プロフィール</strong>から「ショップ情報」をクリック</p>
                            <GuideSmall>※ご本人様のアカウントであれば、マイページからもアクセス可能です。</GuideSmall>
                        </GuideSection>

                        <GuideSection heading='運営者情報について'>
                            <p className={styles.sectionChildP}>
                                会社名、代表者氏名など運営者情報は、ショップ運営者が運営者情報を公開する場合のみ表示されます。
                                <br />ショップ情報を公開していない場合、運営者情報請求フォームから申請すると、メールにてショップ情報が送付されます。
                            </p>
                            <GuideSmall>※運営者情報開示メールの第三者への公開、転送、引用などはお断りしております。</GuideSmall>
                        </GuideSection>
                    </Accordion>

                    <Accordion heading='ショップ情報の変更'>
                        <p className='mt-4 mb-2'>マイページから「<strong>ショップ情報編集</strong>」をクリックし、変更したい項目をクリックするとアクセスできます。</p>

                        <p className='font-bold'>以下を変更する場合、審査が必要になります。審査を通過できなかった場合、変更できません。</p>
                        <ListUl>
                            <ListCheck>代表者氏名</ListCheck>
                            <ListCheck>事業形態</ListCheck>
                            <ListCheck>会社名/屋号</ListCheck>
                            <ListCheck>住所</ListCheck>
                        </ListUl>

                        <p className='mt-4'>※<strong>代表者氏名</strong>を変更する場合、新しい代表者の<strong>顔写真付き身分証</strong>が必要になります。</p>
                    </Accordion>
                </AccordionGrid>
            </Container>

            <Footer />
        </>
    );
}