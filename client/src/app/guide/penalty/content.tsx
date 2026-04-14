import { TitleAndBack, Accordion, AccordionGrid } from '@/components';
import { GuideSubTitle, GuideSection } from '@/components/guide';
import { ListDiscSecond } from '@/components/list';
import { TermsList, TermsListDiv } from '@/components/terms';
import Link from 'next/link';

export const Content = () => {
    return (
        <>
        <TitleAndBack title='禁止行為・ペナルティ' />
        
        <GuideSubTitle text='禁止行為' />
        <AccordionGrid>
            <Accordion heading='禁止行為について'>
                <p className='mt-4 mb-2'>禁止行為を犯した場合、アカウント停止等の利用制限を取る場合がございます。（状況に応じ、ペナルティとなる場合もございます。）また、重大な事案である場合、損害賠償等の措置を取る場合がございます。</p>
            </Accordion>
        
            <Accordion heading='禁止されているコンテンツ'>
                <p className='mt-4 mb-2'>商品の動画や画像・プロフィール画像等のコンテンツにおいて、多くのお客様が安心して当サービスをご覧いただくために、以下の禁止コンテンツを設けております。</p>
        
                <TermsListDiv>
                    <TermsList number={1} text='第三者の権利（著作権、肖像権、名誉権、商標権、特許権、実用新案権、意匠権、プライバシー権、パブリシティ権等を含みますがこれに限られません）を侵害する内容を含むコンテンツ' />
                    <TermsList number={2} text='景品表示法や薬機法等に反する内容を含むコンテンツ' />
                    <TermsList number={3} text='性的なコンテンツ' />
                    <TermsList number={4} text='社会通念上、不健全またはわいせつと認められるコンテンツ' />
                    <TermsList number={5} text='飲酒、喫煙を未成年向けに推奨するコンテンツ等、青少年の保護育成上好ましくないコンテンツ' />
                    <TermsList number={6} text='商品ページで出品する商品以外を販売・提供・宣伝・誘導するコンテンツ' />
                    <TermsList number={7} text='商品ページでの説明と異なる条件を提示する内容のコンテンツ' />
                    <TermsList number={8} text='他者を不快にさせたり、他者の迷惑となる行為を含むコンテンツ' />
                    <TermsList number={9} text='送金を受けることを目的とするコンテンツ' />
                    <TermsList number={10} text='動画自体の視聴による対価を得ようとするコンテンツ（歌唱、演奏、パフォーマンス等）' />
                    <TermsList number={11} text='犯罪による収益の移転防止に関する法律第2条に定める犯罪による収益の移転その他不当な目的で行うコンテンツ' />
                    <TermsList number={12} text='出品ページで出品する商品の宣伝以外を目的とする動画等、本サービスの提供する目的から逸脱したコンテンツ' />
                    <TermsList number={13} text='本サービスの提供する購入者に提供するシステムを利用しない取引を誘引するコンテンツ' />
                    <TermsList number={14} text='盗品' />
                    <TermsList number={15} text='その他法令等や公序良俗に反するコンテンツ' />
                </TermsListDiv>
            </Accordion>
        
            <Accordion heading='禁止されている商品'>
                <p className='mt-4 mb-2'>多くのお客様が安心してお取引いただくために、以下の商品の出品を禁止しております。</p>
        
                <TermsListDiv>
                    <TermsList number={1} text='盗品、入手経路が不明瞭なもの' />
                    <TermsList number={2} text='血液' />
                    <TermsList number={3} text='生き物' />
                    <TermsList number={4} text='電子チケットや電子クーポン、QRコードなどの電子データ' />
                    <TermsList number={5} text='新型コロナウイルスの影響に伴い、取引が禁止されている商品' />
                    <TermsList number={6} text='偽ブランド品' />
                    <TermsList number={7} text='殺傷能力があり武器として使用されるもの' />
                    <TermsList number={8} text='モバイルバッテリーやカートリッジガスこんろ等、製品安全4法（消費生活用製品安全法、電気用品安全法、ガス事業法、液化石油ガスの保安の確保及び取引の適正化に関する法律）が指定する商品について、安全基準を満たす「PSマーク」がないもの' />
                    <TermsList number={9} text='出品時に手元にないもの' />
                    <TermsList number={10} text='生もの等衛生上管理が難しい食品類又は開封済みのもの' />
                    <TermsList number={11} text='酒、たばこ類' />
                    <TermsList number={12} text='現金、金券、カード類' />
                    <TermsList number={13} text='医薬品、医療機器' />
                    <TermsList number={14} text='サービス・権利などの実体のないもの' />
                    <TermsList number={15} text='領収証・公的証明書類' />
                    <TermsList number={16} text='農薬、肥料' />
                    <TermsList number={17} text='土地、建物、自動車' />
                    <TermsList number={18} text='法令により所持や販売が禁止されている商品' />
                    <TermsList number={19} text='規制薬物・危険ドラッグ類' />
                    <TermsList number={20} text='放射性物質を含むおそれがあるもの' />
                    <TermsList number={21} text='アダルト関連商材、児童ポルノやそれに類するとみなされるもの' />
                    <TermsList number={22} text='使用済み下着、体操服、その他不衛生なもの' />
                    <TermsList number={23} text='携帯端末やSIMカード' />
                    <TermsList number={24} text='個人情報を含む商品、個人情報の不正利用' />
                    <TermsList number={25} text='レンタル品など、出品者への返送を必要とするもの' />
                    <TermsList number={26} text='リコール製品のうち、改善対策済みではないもの' />
                    <TermsList number={27} text='その他、法令違反している又はその可能性があるもの、弊社が不適切と判断するもの' />
                </TermsListDiv>
            </Accordion>
        
            <Accordion heading='禁止されている行為'>
                <p className='mt-4 mb-2'>多くのお客様が安心してお取引いただくために、以下の行為を禁止しております。</p>
        
                <GuideSection heading='出品'>
                    <div>
                        <ListDiscSecond>製造や販売にあたり、法令上許可・届出・免許等必要な商品を許可・届出・免許等なく出品すること</ListDiscSecond>
                        <ListDiscSecond>商品の状態がわかる画像・動画等コンテンツを掲載しないこと</ListDiscSecond>
                        <ListDiscSecond>虚偽の情報を記載すること</ListDiscSecond>
                        <ListDiscSecond>販売を目的としない出品行為</ListDiscSecond>
                        <ListDiscSecond>複数商品から選択する形式の出品</ListDiscSecond>
                        <ListDiscSecond>商品に問題があっても返品には応じない等の記載</ListDiscSecond>
                        <ListDiscSecond>オークション形式の出品</ListDiscSecond>
                        <ListDiscSecond>他会員が撮影した画像・動画の使用</ListDiscSecond>
                    </div>
                </GuideSection>
        
                <GuideSection heading='取引'>
                    <div>
                        <ListDiscSecond>商品の詳細がわからない取引</ListDiscSecond>
                        <ListDiscSecond>商品の情報を偽装した取引</ListDiscSecond>
                        <ListDiscSecond>商品を出品者自身が購入すること</ListDiscSecond>
                        <ListDiscSecond>交換・半交換</ListDiscSecond>
                        <ListDiscSecond>○○で用意した決済方法以外の決済を促すこと</ListDiscSecond>
                        <ListDiscSecond>○○で指定している取引の流れに沿わない行為</ListDiscSecond>
                        <ListDiscSecond>マネーロンダリングが疑われる行為</ListDiscSecond>
                    </div>
                </GuideSection>
        
                <GuideSection heading='配送'>
                    <div>
                        <ListDiscSecond>着払いで発送すること</ListDiscSecond>
                        <ListDiscSecond>郵便局（営業所）留めにすること</ListDiscSecond>
                        <ListDiscSecond>手渡しを強要すること</ListDiscSecond>
                        <ListDiscSecond>支払い前に発送することを強要すること</ListDiscSecond>
                    </div>
                </GuideSection>
        
                <GuideSection heading='その他'>
                    <div>
                        <ListDiscSecond>誹謗中傷、荒らしなど迷惑行為</ListDiscSecond>
                        <ListDiscSecond>性的な内容を含む投稿</ListDiscSecond>
                        <ListDiscSecond>外部サービスに誘導する行為</ListDiscSecond>
                        <ListDiscSecond>勧誘活動</ListDiscSecond>
                        <ListDiscSecond>政治的・宗教的または差別的な内容を含む投稿</ListDiscSecond>
                        <ListDiscSecond>個人情報を含む商品の出品</ListDiscSecond>
                        <ListDiscSecond>個人情報の不正利用</ListDiscSecond>
                        <ListDiscSecond>虚偽の情報の投稿</ListDiscSecond>
                        <ListDiscSecond>公序良俗に反する投稿</ListDiscSecond>
                        <ListDiscSecond>その他、弊社が不適切と判断する行為</ListDiscSecond>
                    </div>
                </GuideSection>
        
                <p className='mt-4'>※詳しくは、<Link href='/terms-and-conditions' className='text-blue-600 hover:text-blue-800 hover:underline'>利用規約の禁止行為</Link>をご覧ください。</p>
            </Accordion>
        </AccordionGrid>
        
        <GuideSubTitle text='ペナルティについて' />
        <AccordionGrid>
            <Accordion heading='ペナルティについて'>
                <p className='mt-4 mb-2'>故意ではなく重大ではないペナルティ行為を犯したユーザーには、ペナルティポイントを加算いたします。ペナルティポイントが一定に達した場合、または警告しているにもかかわらず繰り返しペナルティ行為が行われる場合は、アカウント停止、売上金没収、手数料率変更などの処分を科します。</p>
            </Accordion>
        
            <Accordion heading='ペナルティ行為一覧（購入者編）'>
                <GuideSection heading='購入'>
                    <div>
                        <ListDiscSecond>自己都合（ご購入、必要なくなった等）によりキャンセルすること</ListDiscSecond>
                        <ListDiscSecond>購入後に値引きを持ちかけること</ListDiscSecond>
                        <ListDiscSecond>予定より早い日数での発送を求めること</ListDiscSecond>
                        <ListDiscSecond>売却済みの商品に対し、第三者が取引やキャンセルを持ちかけること</ListDiscSecond>
                        <ListDiscSecond>キャンセル申請の承認を強要すること</ListDiscSecond>
                        <ListDiscSecond>キャンセル申請せず、返金を強要すること</ListDiscSecond>
                        <ListDiscSecond>キャンセルしたにもかかわらず、発送を強要すること</ListDiscSecond>
                    </div>
                </GuideSection>
        
                <GuideSection heading='受取'>
                    <div>
                        <ListDiscSecond>商品を受け取らないこと</ListDiscSecond>
                        <ListDiscSecond>配送方法を強要すること</ListDiscSecond>
                        <ListDiscSecond>出品者の意思を確認せず返品すること</ListDiscSecond>
                        <ListDiscSecond>出品者評価をしないこと</ListDiscSecond>
                        <ListDiscSecond>トラブルが無いのに「悪かった」と評価すること</ListDiscSecond>
                        <ListDiscSecond>評価コメントの内容が不適切であること（誹謗中傷等）</ListDiscSecond>
                        <ListDiscSecond>虚偽の評価をすること</ListDiscSecond>
                        <ListDiscSecond>評価コメントに個人情報を記載すること</ListDiscSecond>
                        <ListDiscSecond>受取前に「受け取りました」ボタンを押す、出品者評価をすること</ListDiscSecond>
                    </div>
                </GuideSection>
            </Accordion>
        
            <Accordion heading='ペナルティ行為一覧（出品者編）'>
                <GuideSection heading='出品'>
                    <div>
                        <ListDiscSecond>商品と関係のない動画や画像をアップロードすること</ListDiscSecond>
                        <ListDiscSecond>商品について正確な説明を行わないこと</ListDiscSecond>
                        <ListDiscSecond>取引中の商品を出品すること</ListDiscSecond>
                        <ListDiscSecond>商品状態、紛失、売り切れを理由にキャンセルすること</ListDiscSecond>
                        <ListDiscSecond>購入手続き後に商品の値上げを持ちかけること</ListDiscSecond>
                        <ListDiscSecond>送料の上乗せを持ちかけること</ListDiscSecond>
                        <ListDiscSecond>値上げを理由にキャンセルすること</ListDiscSecond>
                    </div>
                </GuideSection>
        
                <GuideSection heading='発送'>
                    <div>
                        <ListDiscSecond>着払い、送料不足で発送すること</ListDiscSecond>
                        <ListDiscSecond>発送前に「発送しました」ボタンを押すこと</ListDiscSecond>
                        <ListDiscSecond>商品説明と異なるものを発送すること</ListDiscSecond>
                        <ListDiscSecond>商品と関係ないものをセットで発送すること</ListDiscSecond>
                        <ListDiscSecond>第三者が取引を代行すること</ListDiscSecond>
                        <ListDiscSecond>差出人情報を記載せずに発送すること</ListDiscSecond>
                        <ListDiscSecond>○○で知り得た個人情報を取引以外の目的で利用すること</ListDiscSecond>
                        <ListDiscSecond>梱包に不十分な点があること</ListDiscSecond>
                        <ListDiscSecond>「良かった」の評価をつけるよう指定すること</ListDiscSecond>
                    </div>
                </GuideSection>
            </Accordion>
        
            <Accordion heading='ペナルティ行為一覧（その他）'>
                <div className='mt-4 mb-2 ml-[1rem]'>
                    <ListDiscSecond>配送先情報または差出人情報に誤りがあること</ListDiscSecond>
                    <ListDiscSecond>返品合意後に商品の返送・受取を拒否すること</ListDiscSecond>
                    <ListDiscSecond>進行中の取引を放棄すること</ListDiscSecond>
                    <ListDiscSecond>キャンセル料や迷惑料を請求すること</ListDiscSecond>
                    <ListDiscSecond>虚偽の情報を記載すること</ListDiscSecond>
                    <ListDiscSecond>誹謗中傷など不適切なコメントを投稿すること</ListDiscSecond>
                </div>
            </Accordion>
        </AccordionGrid>
        </>
    );
}