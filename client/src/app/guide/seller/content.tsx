import { Client } from "./client";
import { TitleAndBack, Accordion, AccordionGrid } from "@/components";
import { GuideSubTitle, GuideSmall, GuideSection } from "@/components/guide";
import { ListUl, ListFlow, ListFlowArrow, ListCheck } from "@/components/list";
import { TermsList, TermsListDiv } from "@/components/terms";
import { RowTextContainer } from "@/components/two-text-container/tow-text-container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import styles from "@/styles/guide.module.css";
import clsx from "clsx";
import Link from "next/link";

export const Content = () => {
    return (
        <>
            <TitleAndBack title="出品者の方" />

            <GuideSubTitle text="出品について" />
            <AccordionGrid>
                <Accordion heading="出品方法">
                    <p className={clsx("mt-4 mb-2", styles.PHeading)}>かんたん出品ガイド</p>

                    <ListUl>
                        <ListFlow number={1}>
                            フッターの「出品する
                            <FontAwesomeIcon icon={faSquarePlus} className="text-lg px-2 text-[var(--theme)]" />
                            」ボタンをクリック（PCはヘッダー右側）
                        </ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={2}>動画、画像、価格など商品関連情報をアップロード</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={3}>プレビューで確認</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={4}>
                            <strong className="text-[var(--theme)]">出品完了！</strong>
                        </ListFlow>
                    </ListUl>
                </Accordion>

                <Accordion heading="動画の内容">
                    <p className="mt-4 mb-2">
                        <span className="text-[var(--theme)] font-bold">○○</span>
                        では、商品の内容や特徴が伝わればどんな動画でも構いません！
                        <br />
                        動画にすることで、より商品の内容がはっきり伝わり、商品の良さや特徴を理解していただけるようなります。
                    </p>

                    <p className="mt-4">出品時、以下の内容をアップロードしていただきます。</p>
                    <ListUl>
                        <ListCheck>動画</ListCheck>
                        <ListCheck>サムネイル</ListCheck>
                        <ListCheck>動画タイトル</ListCheck>
                        <ListCheck>動画の概要</ListCheck>
                    </ListUl>

                    <p className={clsx("mt-4", styles.PHeading)}>タイトル、概要</p>
                    <p className="mt-2">
                        動画のタイトルは、動画や商品の内容を踏まえて一言で表し、なるべく見た人がわかりやすく、興味を引くようなタイトルをつけましょう。
                        <br />
                        動画の概要は、動画の見どころとなる部分を文章で表現しましょう。また、商品の良さや特徴が伝わる内容にするとよいでしょう。
                    </p>

                    <GuideSmall>※動画の容量：500MBまで</GuideSmall>
                </Accordion>

                <Accordion heading="商品関連情報の内容">
                    <p className="mt-4">出品時、以下の内容をアップロードしていただきます。</p>
                    <ListUl>
                        <ListCheck>画像（10枚まで）</ListCheck>
                        <ListCheck>商品名</ListCheck>
                        <ListCheck>商品説明</ListCheck>
                        <ListCheck>カテゴリー</ListCheck>
                        <ListCheck>商品の状態</ListCheck>
                        <ListCheck>配送方法</ListCheck>
                        <ListCheck>発送元地域</ListCheck>
                        <ListCheck>発送までの日数</ListCheck>
                        <ListCheck>販売価格</ListCheck>
                    </ListUl>

                    <GuideSmall>
                        ※商品が記載の内容と異なる、発送時に記載の内容と異なる方法へ発送するなどが確認された場合、ペナルティポイントが課されることがございます。責任をもって、正確な情報を記載するように心がけましょう。
                    </GuideSmall>
                </Accordion>

                <Accordion heading="販売手数料について">
                    <p className="mt-4 mb-2">
                        <span className="text-[var(--theme)] font-bold">○○</span>
                        は、決済時に販売手数料を徴収しております。
                    </p>

                    <p>手数料率は以下の通りです。</p>
                    <p className={clsx("mt-2 ml-[2rem]", styles.PHeading)}>
                        商品代金の<span className="text-[var(--theme)]">10%</span>
                    </p>

                    <GuideSmall>※商品代金から販売手数料を引いた額が売上金となります。</GuideSmall>
                    <GuideSmall>※キャンペーン等により変更することがあります。</GuideSmall>
                </Accordion>
            </AccordionGrid>

            <GuideSubTitle text="売上金、振込申請" />
            <AccordionGrid>
                <Accordion heading="売上金の入金時期、入金額">
                    <p className="mt-4 mb-2">売上金の入金時期</p>
                    <p className="block ml-[1rem] text-[var(--theme)]">
                        <strong>購入者が商品を受け取り、出品者評価を完了したとき</strong>
                    </p>
                    <div className="ml-[2rem] mt-1">
                        <p>
                            購入者が出品者評価をしなかった場合、決済から
                            <strong className="text-[var(--theme-sub)]">30日後</strong>に入金されます。
                        </p>
                        <GuideSmall>※規約違反などが確認された場合、入金されないことがございます。</GuideSmall>
                    </div>

                    <p className="mt-4 mb-2">売上金の入金額</p>
                    <div className="ml-[1rem]">
                        <p className="text-[var(--theme)]">
                            <strong>商品代金から販売手数料を引いた額が入金されます。</strong>
                        </p>
                        <p>
                            ※商品代金の<strong className="text-[var(--theme-sub)]">90%</strong>相当額
                        </p>
                    </div>

                    <GuideSmall>※売上金はマイページからご確認いただけます。</GuideSmall>
                </Accordion>

                <Accordion heading="振込申請の方法">
                    <p className="mt-4 mb-2">振込申請の方法は以下の通りです。</p>

                    <ListUl>
                        <ListFlow number={1}>
                            マイページの「<strong className="text-[var(--theme)]">振込申請</strong>」をクリック
                        </ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={2}>口座情報を入力</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={3}>振込申請額を入力</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={4}>メールが届いたら申請完了！振込予定日までお待ちください。</ListFlow>
                    </ListUl>
                </Accordion>

                <Accordion heading="振込日について">
                    <p className={clsx("mt-4 mb-2", styles.PHeading)}>
                        振込申請を行った日の<span className="text-[var(--alert)]">翌々週金曜日</span>に振込されます。
                    </p>

                    <p className="font-bold">※振込予定日が金融機関の休業日である場合、その翌営業日に振込されます。</p>

                    <GuideSmall>
                        ※弊社都合により、振込日が予定日から変動する可能性がございます。その場合、可能な限り前もってメール、サイト内お知らせ等で通知いたします。
                    </GuideSmall>
                    <GuideSmall>※金利等による金額の変動はありません。</GuideSmall>
                </Accordion>

                <Accordion heading="売上金の保管期限">
                    <p className={clsx("mt-4 mb-2", styles.PHeading)}>
                        売上金の保管期限は、当該売上金が加算された日から
                        <span className="text-[var(--alert)]">180日後</span>です。
                    </p>
                    <p>期限内に振込申請またはポイント変換を行ってください。</p>

                    <GuideSmall>※振込申請またはポイント変換の際、古い順に売上金が使用されます。</GuideSmall>

                    <Client />

                    <GuideSmall>
                        ※スマートフォン等で文字が小さくて見づらい場合、画像をタップして全画面表示にしてください。
                    </GuideSmall>

                    <p className="font-bold mt-4">
                        有効期限切れの売上金は、請求権を放棄したものとみなし、弊社が回収いたします。
                    </p>
                    <GuideSmall>
                        ※期限が近付いたユーザーには、当サイトのお知らせまたはメールにて通知いたします。申請し忘れのないようにご注意ください。
                    </GuideSmall>

                    <p className="font-bold mt-4">
                        事前に口座登録しているユーザーには、期限を経過した場合、登録されている口座にお振込みいたします。
                    </p>
                    <GuideSmall>振込日：期限が経過した月の翌月の10日（金融機関が休業日の場合、翌営業日）</GuideSmall>
                </Accordion>

                <Accordion heading="振込申請の注意点">
                    <GuideSection heading="振込申請は1,000円からです！">
                        振込申請の最低金額は<strong className="text-[var(--theme)]">1,000円</strong>
                        です。売上金が1,000円未満の場合、振込申請ができません。
                    </GuideSection>
                    <GuideSection heading="振込が200円かかります。">
                        振込申請1回につき手数料<strong className="text-[var(--theme)]">200円</strong>
                        徴収いたします。一気にまとめて申請する方がお得です。
                    </GuideSection>
                    <GuideSection heading="口座情報に不備がある場合、振込できません。その際も振込手数料200円発生します。">
                        振込できない場合も、振込手数料200円発生します。振込申請の際は、お間違いがないか慎重にご確認お願いします。
                    </GuideSection>
                    <GuideSection heading="口座情報の誤りで第三者の口座に振り込んだ場合、組戻し手数料880円が発生します。">
                        口座情報にお間違いがないよう、慎重に確認を行ってください。
                    </GuideSection>
                </Accordion>

                <Accordion heading="ポイント変換">
                    <GuideSection heading="売上金はポイントに変換することができます。">
                        ポイントは<strong className="text-[var(--theme)]">○○</strong>でのお支払いにご利用いただけます。
                    </GuideSection>
                    <GuideSection heading="ポイントの有効期限：保有日から180日後">
                        ポイントは売上金と同様に保有日から<strong className="text-[var(--theme)]">180日後</strong>
                        まで使用されなかった場合、無効になり、弊社が回収いたします。
                    </GuideSection>
                </Accordion>
            </AccordionGrid>

            <GuideSubTitle text="禁止事項・制限事項" />
            <AccordionGrid>
                <Accordion heading="動画・画像における禁止事項">
                    <p className="mt-4 mb-2">
                        <strong className="text-[var(--theme)]">○○</strong>
                        の商品動画・画像では以下のものを禁止しております。
                    </p>

                    <TermsListDiv>
                        <TermsList
                            number={1}
                            text="第三者の権利（著作権、肖像権、名誉権、商標権、特許権、実用新案権、意匠権、プライバシー権、パブリシティ権等を含みますがこれに限られません）を侵害する内容を含むコンテンツ"
                        />
                        <TermsList number={2} text="景品表示法や薬機法等に反する内容を含むコンテンツ" />
                        <TermsList number={3} text="性的なコンテンツ" />
                        <TermsList number={4} text="社会通念上、不健全またはわいせつと認められるコンテンツ" />
                        <TermsList
                            number={5}
                            text="飲酒、喫煙を未成年向けに推奨するコンテンツ等、青少年の保護育成上好ましくないコンテンツ"
                        />
                        <TermsList
                            number={6}
                            text="商品ページで出品する商品以外を販売・提供・宣伝・誘導するコンテンツ"
                        />
                        <TermsList number={7} text="商品ページでの説明と異なる条件を提示する内容のコンテンツ" />
                        <TermsList number={8} text="他者を不快にさせたり、他者の迷惑となる行為を含むコンテンツ" />
                        <TermsList number={9} text="送金を受けることを目的とするコンテンツ" />
                        <TermsList
                            number={10}
                            text="動画自体の視聴による対価を得ようとするコンテンツ（歌唱、演奏、パフォーマンス等）"
                        />
                        <TermsList
                            number={11}
                            text="犯罪による収益の移転防止に関する法律第2条に定める犯罪による収益の移転その他不当な目的で行うコンテンツ"
                        />
                        <TermsList
                            number={12}
                            text="出品ページで出品する商品の宣伝以外を目的とする動画等、本サービスの提供する目的から逸脱したコンテンツ"
                        />
                        <TermsList
                            number={13}
                            text="本サービスの提供する購入者に提供するシステムを利用しない取引を誘引するコンテンツ"
                        />
                        <TermsList number={14} text="盗品" />
                        <TermsList number={15} text="その他法令等や公序良俗に反するコンテンツ" />
                    </TermsListDiv>

                    <p className="mt-4 mb-2">
                        詳しくは
                        <Link
                            href="/trams-and-conditions"
                            className="text-blue-600 hover:underline hover:text-blue-800"
                        >
                            利用規約
                        </Link>
                        をご覧ください。
                    </p>
                    <p className="text-[var(--alert)] font-bold">
                        ※上記の禁止事項に違反した場合、即時ペナルティ対象となります。
                    </p>
                </Accordion>

                <Accordion heading="出品における禁止事項">
                    <p className="mt-4 mb-2">以下に該当する商品の出品を禁止しています。</p>

                    <TermsListDiv>
                        <TermsList number={1} text="盗品、入手経路が不明瞭なもの" />
                        <TermsList number={2} text="血液" />
                        <TermsList number={3} text="生き物" />
                        <TermsList number={4} text="電子チケットや電子クーポン、QRコードなどの電子データ" />
                        <TermsList number={5} text="新型コロナウイルスの影響に伴い、取引が禁止されている商品" />
                        <TermsList number={6} text="偽ブランド品" />
                        <TermsList number={7} text="殺傷能力があり武器として使用されるもの" />
                        <TermsList
                            number={8}
                            text="モバイルバッテリーやカートリッジガスこんろ等、製品安全4法（消費生活用製品安全法、電気用品安全法、ガス事業法、液化石油ガスの保安の確保及び取引の適正化に関する法律）が指定する商品について、安全基準を満たす「PSマーク」がないもの"
                        />
                        <TermsList number={9} text="出品時に手元にないもの" />
                        <TermsList number={10} text="生もの等衛生上管理が難しい食品類又は開封済みのもの" />
                        <TermsList number={11} text="酒、たばこ類" />
                        <TermsList number={12} text="現金、金券、カード類" />
                        <TermsList number={13} text="医薬品、医療機器" />
                        <TermsList number={14} text="サービス・権利などの実体のないもの" />
                        <TermsList number={15} text="領収証・公的証明書類" />
                        <TermsList number={16} text="農薬、肥料" />
                        <TermsList number={17} text="土地、建物、自動車" />
                        <TermsList number={18} text="法令により所持や販売が禁止されている商品" />
                        <TermsList number={19} text="規制薬物・危険ドラッグ類" />
                        <TermsList number={20} text="放射性物質を含むおそれがあるもの" />
                        <TermsList number={21} text="アダルト関連商材、児童ポルノやそれに類するとみなされるもの" />
                        <TermsList number={22} text="使用済み下着、体操服、その他不衛生なもの" />
                        <TermsList number={23} text="携帯端末やSIMカード" />
                        <TermsList number={24} text="個人情報を含む商品、個人情報の不正利用" />
                        <TermsList number={25} text="レンタル品など、出品者への返送を必要とするもの" />
                        <TermsList number={26} text="リコール製品のうち、改善対策済みではないもの" />
                        <TermsList
                            number={27}
                            text="その他、法令違反している又はその可能性があるもの、弊社が不適切と判断するもの"
                        />
                    </TermsListDiv>

                    <p className="mt-4 mb-2">
                        詳しくは
                        <Link
                            href="/trams-and-conditions"
                            className="text-blue-600 hover:underline hover:text-blue-800"
                        >
                            利用規約
                        </Link>
                        をご覧ください。
                    </p>
                    <p className="text-[var(--alert)] font-bold">
                        ※上記の禁止事項に違反した場合、即時ペナルティ対象となります。
                    </p>
                </Accordion>

                <Accordion heading="出品における禁止事項">
                    <p className="mt-4 mb-2">利用規約に違反した場合、以下のペナルティが課されます。</p>

                    <TermsListDiv>
                        <TermsList number={1} text="売上金相当額の没収" />
                        <TermsList number={2} text="手数料率の変更" />
                        <TermsList number={3} text="アカウント削除" />
                        <TermsList number={4} text="その他上記に類似する弊社が指定する処分" />
                    </TermsListDiv>

                    <p className="mt-4 mb-2">
                        悪意がなく、過失による軽微な違反と弊社が判断した場合、警告のみとさせていただきます。なお、何度警告しても改善されない場合、上記の処分を科します。
                    </p>
                    <p>
                        ※アカウント削除およびサービスの利用停止処分をされた場合、売上金およびポイントは全額没収となります。
                    </p>
                </Accordion>
            </AccordionGrid>

            <GuideSubTitle text="配送について" />
            <AccordionGrid>
                <Accordion heading="送料について">
                    <p className="mt-4 mb-2 font-bold">
                        送料は<span className="text-[var(--theme)]">出品者の負担</span>となります。
                    </p>

                    <p>発送時に配送会社が指定する額をお支払いください。</p>
                    <GuideSmall>
                        ※着払いで発送した、購入者に送料の支払いを強要した場合、ペナルティの対象となります。
                    </GuideSmall>
                </Accordion>

                <Accordion heading="梱包について">
                    <GuideSection heading="梱包する際は、必ず発送時と同じ状態を維持できるように梱包してください。">
                        ダンボールやクッション材などを使って、商品が壊れる、傷つく、汚れる、濡れる、腐る等ないようにしてください。
                    </GuideSection>

                    <p className="mt-4 mb-2">発送する際には以下のことが無いように気を付けてください。</p>
                    <ListUl>
                        <ListCheck>サイズオーバー、重量オーバー</ListCheck>
                        <ListCheck>送り先間違い</ListCheck>
                        <ListCheck>付属品の入れ忘れ</ListCheck>
                    </ListUl>
                </Accordion>

                <Accordion heading="取引明細の表示方法">
                    <p className="mt-4 mb-2">取引明細の表示方法は以下の通りです。</p>
                    <ListUl>
                        <ListCheck>「お知らせ」から該当するお知らせをクリック</ListCheck>
                        <ListCheck>マイページから「売上履歴」ページを開き、各取引をクリック</ListCheck>
                    </ListUl>

                    <GuideSmall>
                        ※○○では、領収書や適格請求書の発行は行っておりません。当サイトの取引明細、購入明細を代わりにご利用ください。購入者から領収書等の発行を求められた場合、お手数お掛けしますが、ご自身でご対応をお願いいたしております。
                    </GuideSmall>
                </Accordion>

                <Accordion heading="配送状況について">
                    <p className="mt-4 mb-2">
                        配送状況は、<strong className="text[var(--theme)]">取引明細ページの上部</strong>に表示されます。
                    </p>

                    <ListUl>
                        <ListCheck>発送待ち</ListCheck>
                        <ListCheck>配送中</ListCheck>
                        <ListCheck>受取済み</ListCheck>
                    </ListUl>

                    <p className={clsx("mt-4", styles.PHeading)}>配送状況は、以下により変化します。</p>
                    <div className="mt-2 ml-[1rem]">
                        <RowTextContainer heading="発送待ち→配送中：">
                            出品者が配送会社と配送手続きを完了し、取引明細ページの「
                            <span className="text-blue-700">発送しました</span>」ボタンを押したとき
                        </RowTextContainer>
                        <RowTextContainer heading="配送中→受取済み：">
                            購入者が商品を受け取り、購入明細ページから「
                            <strong className="text-[var(--theme)]">受け取りました</strong>
                            」ボタンを押し、出品者評価を終えたとき
                        </RowTextContainer>
                    </div>

                    <p className="text-[var(--alert)] font-bold">
                        ※出品者が「発送しました」ボタンを押さなかった場合、発送済みでも「発送待ち」と表示されることがあります。購入者が受け取りをスムーズに行えない可能性があるため、必ず「発送しました」ボタンを押してください。
                    </p>
                    <GuideSmall>※低評価につながる恐れがあります。</GuideSmall>
                </Accordion>

                <Accordion heading="出品者評価">
                    <p className="mt-4 mb-2 font-bold">購入者は、出品者に対して、商品や取引に関して評価を行います。</p>
                    <p className="ml-[1rem]">
                        出品者評価は「<span className="text-blue-700">良かった</span>」「
                        <span className="text-[var(--alert)]">悪かった</span>」の二択で行っております。
                    </p>
                    <p className="ml-[1rem]">
                        「<span className="text-[var(--alert)]">悪かった</span>
                        」場合、悪かった理由についての報告があります。
                    </p>

                    <GuideSection heading="5つ星評価">
                        「<span className="text-blue-700">良かった</span>」は5、「
                        <span className="text-[var(--alert)]">悪かった</span>
                        」は1とし、平均値をユーザーネームの下に5つ星で表します。また、5つ星の右の数字は評価の件数です。
                    </GuideSection>

                    <p className="mt-2 font-bold">
                        投稿ページに記載している内容と偽りがあると「
                        <span className="text-[var(--alert)]">悪かった</span>
                        」がつきやすくなります。購入者から信頼される取引をして、高評価を目指しましょう！
                    </p>

                    <GuideSection heading="出品者評価と売上金入金">
                        購入者が出品者評価を終えると売上金が入金されます。購入者が出品者評価をしなかった場合、購入から
                        <strong className="text-[var(--theme)]">30日後</strong>に売上金が入金されます。
                    </GuideSection>
                </Accordion>

                <Accordion heading="キャンセル">
                    <p className="mt-4 mb-2 font-bold">
                        購入者からの<span className="text-[var(--alert)]">キャンセル申請</span>
                        を承認したら、取引がキャンセルとなります。
                    </p>

                    <GuideSmall>※キャンセルされた場合、該当する商品は再び販売されます。</GuideSmall>
                    <GuideSmall>
                        ※キャンセル申請を承認または却下せず、放置し続けた場合、ペナルティの対象となる場合がございます。
                    </GuideSmall>
                </Accordion>
            </AccordionGrid>

            <GuideSubTitle text="その他" />
            <AccordionGrid>
                <Accordion heading="商品ページの内容">
                    <p className="mt-4 mb-2">商品ページに記載の主な内容は以下の通りです。</p>
                    <GuideSection heading="動画">商品に関連する動画です。どなたでもご覧いただけます。</GuideSection>

                    <p className={clsx("mt-4 mb-2", styles.PHeading)}>商品</p>
                    <p className={styles.sectionChild}>商品ページには以下の内容が記載されています。</p>
                    <ListUl>
                        <ListCheck>商品名</ListCheck>
                        <ListCheck>価格</ListCheck>
                        <ListCheck>商品説明</ListCheck>
                        <ListCheck>商品の状態</ListCheck>
                        <ListCheck>配送情報</ListCheck>
                    </ListUl>

                    <GuideSection heading="コメント">
                        動画や商品に対するユーザーのコメントを閲覧できます。また、ご自身でコメントを投稿することができます（ログインユーザーのみ）。
                    </GuideSection>

                    <p className="mt-4">このほかにも様々な機能がございます。</p>
                </Accordion>

                <Accordion heading="商品を編集したい">
                    <ListUl>
                        <ListFlow number={1}>
                            商品ページを開き、一番下までスクロールし、「
                            <span className="text-blue-700">商品の内容を変更する</span>」をクリックします。
                        </ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={2}>変更したい内容を入力して、再度アップロードします。</ListFlow>
                    </ListUl>

                    <GuideSmall>すでに売り切れた商品の編集はできません。</GuideSmall>
                </Accordion>

                <Accordion heading="商品を削除したい">
                    <ListUl>
                        <ListFlow number={1}>
                            商品ページを開き、一番下までスクロールし、「
                            <span className="text-blue-700">商品を削除する</span>」をクリックします。
                        </ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={2}>
                            注意事項を確認したら、「<span className="font-bold text-[var(--alert)]">削除する</span>
                            」ボタンをクリックすると、商品が削除されます。
                        </ListFlow>
                    </ListUl>

                    <GuideSmall>※削除された商品のデータは元に戻りません。</GuideSmall>
                </Accordion>
            </AccordionGrid>
        </>
    );
};
