import { TitleAndBack, Container, Header, Footer } from 'components'
import { TermsMiniSection, TermsList, TermsListDiv } from 'components/terms'
import styles from 'styles/terms.module.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "プライバシーポリシー | FLEX OUTDOOR",
    description: "FLEX OUTDOORのプライバシーポリシーはこちら！",
    robots: {
        index: false,
        follow: false
    }
}

export default function PrivacyPolicy() {
    return (
        <>
        <Header />

        <Container header>
            <TitleAndBack title='プライバシーポリシー' />

            <section className='max-w-[768px] m-auto mb-[3rem]'>
                <TermsMiniSection number={1} heading='総則'>
                    <p>（1）ウェブサービスである「FLEX OUTDOOR」（以下「本サービス」といいます。）を運営するFLEX OUTDOOR（以下「弊社」といいます。）は、本サービスのユーザー（以下「ユーザー」といいます。）のプライバシーを尊重し、ユーザーの個人情報及びその他のユーザーのプライバシーに係る情報（以下「プライバシー情報」といいます。）の管理に細心の注意を払うため、弊社は、本プライバシーポリシーに基づいて、プライバシー情報を扱います。
                        <br />（2）弊社は、個人情報保護法をはじめとする各法令およびその他の規範を遵守してユーザーから収集した個人情報を適切に取り扱います。また、弊社は、個人情報を取り扱う体制の強化等、プライバシー情報等の取り扱いについて、継続的な改善を図っています。
                    </p>
                </TermsMiniSection>

                <TermsMiniSection number={2} heading='本ポリシーへの同意、同意の撤回'>
                    <p>（1）ユーザーは、会員登録又は問い合わせ等を通じて弊社に自身のプライバシー情報を提供する場合、本ポリシーを熟読し、その内容に同意するも落とします。
                        <br />（2）ユーザーは、弊社によるプライバシー情報の使用等について同意を撤回することができます。この場合、本サービスを継続利用することはできません。
                        <br />（3）本条の本ポリシーへの同意及び撤回は、それぞれ弊社が定める手段によりなされるものとします。
                    </p>
                </TermsMiniSection>

                <TermsMiniSection number={3} heading='収集するプライバシー情報'>
                    <p>弊社は、本サービスの提供に際して、ユーザーから以下の情報を収集又は取得します。
                        <br />ユーザーがフォーム等に入力することにより提供する情報：
                    </p>

                    <TermsListDiv>
                        <TermsList number={1} text='氏名、生年月日、性別、その他の特定の個人を識別できる情報' />
                        <TermsList number={2} text='特定の個人情報に結びついて使用される住所、電話番号、メールアドレス、その他アカウント情報' />
                        <TermsList number={3} text='口座情報、クレジットカード情報' />
                        <TermsList number={4} text='ユーザーの本人確認に関する情報' />
                    </TermsListDiv>

                    <p>弊社が本サービスの利用に関連して取得する情報：</p>

                    <TermsListDiv>
                        <TermsList number={1} text='ユーザーがご利用になった本サービスの内容、ご利用日時及び回数、本サービス利用時のユーザーのオンライン行動等、ユーザーによる本サービスの利用・閲覧に関連する情報（これにはCookie情報、アクセスログ等の利用状況に関する情報、ご利用の端末情報、OS情報、位置情報、ユーザーの通信に関する情報を含みます）' />
                        <TermsList number={2} text='ユーザーが本サービスに掲載・発信した投稿、写真、動画、コメント、評価その他の情報' />
                        <TermsList number={3} text='ユーザーの本サービスでの決済状況に関する情報' />
                    </TermsListDiv>
                </TermsMiniSection>

                <TermsMiniSection number={4} heading='プライバシー情報の利用目的'>
                    <p>弊社は、ユーザーから収集したプライバシー情報を本サービスの運営の目的のために使用します。主な利用目的は以下の通りです。</p>

                    <TermsListDiv>
                        <TermsList number={1} text='料金請求、本人確認、認証のため' />
                        <TermsList number={2} text='本人確認のため' />
                        <TermsList number={3} text='決済のため' />
                        <TermsList number={4} text='売上金の振込のため' />
                        <TermsList number={5} text='利用規約やポリシーの変更等重要な通知を送信するため' />
                        <TermsList number={6} text='本サービスのコンテンツやサービスの内容や品質の向上のため' />
                        <TermsList number={7} text='アンケート、懸賞、キャンペーン等実施のため' />
                        <TermsList number={8} text='マーケティング調査、統計、分析のため' />
                        <TermsList number={9} text='システムメンテナンス、不具合対応のため' />
                        <TermsList number={10} text='広告の配信及びその成果の確認のため' />
                        <TermsList number={11} text='技術サポートの提供、ユーザーからのお問い合わせ対応のため' />
                        <TermsList number={12} text='ターゲットを絞った弊社又は第三者の商品又はサービスの広告の開発、提供のため' />
                        <TermsList number={13} text='不正行為又は違法となる可能性のある行為を防止するため' />
                        <TermsList number={14} text='クレーム、紛争、訴訟等の対応のため' />
                    </TermsListDiv>
                </TermsMiniSection>

                <TermsMiniSection number={5} heading='プライバシー情報の第三者提供'>
                    <p>（1）弊社は、ユーザーの個人情報を第三者に開示または提供する場合、その提供先・提供内容を開示し、ユーザー本人の同意を得るものとします。なお、弊社は、以下の場合を除き、ユーザー本人の事前の同意を得ることなく、個人情報を第三者に開示または提供することはありません。</p>

                    <TermsListDiv>
                        <TermsList number={1} text='法令等の定めに基づいて開示等を請求された場合' />
                        <TermsList number={2} text='弁護士、警察、検察等から捜査に必要な範囲で開示等を請求された場合' />
                        <TermsList number={3} text='弊社の関連会社間で情報を共有する場合' />
                        <TermsList number={4} text='本サービスの提供に必要な範囲で第三者に業務の一部を委託する場合' />
                        <TermsList number={5} text='本サービスの提供に必要な範囲で決済代行会社に情報を提供する必要がある場合' />
                    </TermsListDiv>

                    <p>（2）弊社は、個人情報の取り扱いを第三者に委託する場合、個人情報保護法に従って、委託先に対する必要かつ適切な監督を行います。
                        <br />（3）弊社は、合弁や分割等で弊社の事業を第三者に譲渡する場合または本サービスの一部または全部を第三者に譲渡する場合、本サービスに係るユーザーの個人情報等を当該第三者に提供します。
                    </p>
                </TermsMiniSection>

                <TermsMiniSection number={6} heading='プライバシー情報の管理・保管期間'>
                    <p>（1）弊社は、ユーザーが本サービスを利用している期間中、当該ユーザーから開示または提供されたプライバシー情報の漏洩、改ざん等を防止するため、現時点での技術水準に合わせた必要かつ適切な安全管理措置を講じます。
                        <br />（2）弊社は、弊社が管理するプライバシー情報を利用する必要が無くなった場合、当該プライバシー情報を遅滞なく消去するよう努めるものとします。また、ユーザーよりプライバシー情報の削除を要求された場合も、同様とします。
                    </p>
                </TermsMiniSection>

                <TermsMiniSection number={7} heading='ユーザーによる照会等への対応'>
                    <p>（1）ユーザーは、弊社に対して、弊社が保有する自身のプライバシー情報の開示、訂正、追加または削除、利用停止を請求することができます。
                        <br />（2）ユーザーは、弊社が定める手段によって前項の開示等の請求をするものとします。なお、同請求は、ユーザー本人、法定代理人または当該請求につきユーザー本人より委託された代理人のみすることができます。
                        <br />（3）弊社は、開示等の請求を受けた場合、弊社が定める手段によって本人確認したうえで、相当な期間内にこれに対応します。なお、弊社は、法令に基づき開示等をしない決定をした場合、その旨をユーザーに通知するものとします。
                        <br />（4）ユーザーは、プライバシー情報の開示等に際して、以下に定める手数料を支払わなければなりません。
                        <br />開示、照会、追加、訂正及び削除請求にかかる手数料額：500円 + 送料
                    </p>
                </TermsMiniSection>

                <TermsMiniSection number={8} heading='Cookieの使用'>
                    <p>（1）弊社は、本サービスの利便性向上のため、セッションの維持および保護セキュリティのため、また、新しいサービスを検討するため、サービスや広告の内容をよりユーザーに適したものにするためにCookieを利用します。
                        <br />（2）Cookieの使用を許可するかにつきましては、ユーザー自身で設定できます。ブラウザの設定で、Cookieの使用を禁止することが可能です。ただし、Cookieの使用を禁止した場合、本サービスをせい正常に利用できない、あるいはCookieを必要とする広告設定を反映できなくなる可能性があります。
                    </p>
                </TermsMiniSection>

                <TermsMiniSection number={9} heading='Googleアナリティクスの使用'>
                    <p>弊社は、本サービスの利用状況を調査・分析するため、本サービス上にGoogle社が提供するGoogleアナリティクスを利用しています。Googleアナリティクスの利用規約およびGoogle社のプライバシーポリシーが適用されます。
                        <br />Googleアナリティクス　利用規約：
                        <br /><span className='text-blue-600 hover:text-blue-800 hover:underline cursor-pointer break-all'>https://marketingplatform.google.com/about/analytics/terms/jp/</span>
                        <br />Google　プライバシーポリシー：
                        <br /><span className='text-blue-600 hover:text-blue-800 hover:underline cursor-pointer break-all'>https://policies.google.com/privacy?hl=ja</span>
                    </p>
                </TermsMiniSection>

                <TermsMiniSection number={10} heading='本ポリシーの変更'>
                    <p>（1）弊社は、自身の判断にて、本ポリシーを改定することができます。弊社は、本ポリシーを改定する場合、緊急性がある場合を除き、事前に弊社が適当であると判断する手段にてユーザーにその旨を通知するものとします。
                        <br />（2）本ポリシーの改定は、改定後のプライバシーポリシーを本サービスにかかるWEBサイト上に掲載した時点で効力を生じるものとします。
                        <br />（3）ユーザーは、本ポリシーの改定に同意することができない場合、弊社に対して、第7条に定める手段にて自身のプライバシー情報の削除を要求することができます。
                    </p>
                </TermsMiniSection>

                <TermsMiniSection number={11} heading='合意管轄、準拠法'>
                    <p>（1）本ポリシーは、日本国法に準拠して解釈されるものとします。
                        <br />（2）ユーザーは、本ポリシーに関連して紛争等が発生した場合、東京地方裁判所において第一審の裁判を行うことにあらかじめ同意するものとします。
                    </p>
                </TermsMiniSection>

                <TermsMiniSection number={12} heading='管理責任者'>
                    <p>弊社では、個人情報の管理責任者を以下の者として、個人情報の適切な管理及び個人情報保護に関する施策の継続的な改善を実施しています。なお、個人情報に関するお問い合わせ、ご相談、第7条の開示等の請求の窓口もこちらをご利用ください。
                        <br />運営者：FLEX OUTDOOR
                        <br />メールアドレス：support@flex-outdoor-mail.com
                        <br />開示等の請求の方法：メール、郵送
                    </p>
                </TermsMiniSection>

                <p className={styles.date}>2025年○○月○○日　施行</p>
            </section>
        </Container>

        <Footer />
        </>
    )
}