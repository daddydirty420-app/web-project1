import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { TitleAndBack, Accordion, AccordionGrid } from "@/components";
import { GuideSubTitle, GuideSmall, GuideLink } from "@/components/guide";
import { ListUl, ListFlow, ListFlowArrow, ListCheck, Nado, ListUlSecond, ListDiscSecond } from "@/components/list";
import styles from "@/styles/guide.module.css";
import clsx from "clsx";

export const Content = () => {
    return (
        <>
            <TitleAndBack title="アカウントについて" />

            <AccordionGrid>
                <GuideLink heading="会員登録について" url="account/sign" />
            </AccordionGrid>

            <GuideSubTitle text="会員登録、ログイン" />
            <AccordionGrid>
                <Accordion heading="ログイン方法">
                    <ListUl>
                        <ListFlow number={1}>「ログイン」ボタンをクリックし、ログインページを開く</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={2}>
                            登録した<span className="text-red-600">メールアドレス</span>、
                            <span className="text-blue-700">パスワード</span>を入力し、「ログイン」ボタンをクリック
                        </ListFlow>
                    </ListUl>
                </Accordion>

                <Accordion heading="ログインできない">
                    <p className="mt-4 mb-2">ログインできない場合、以下の原因が考えられます。</p>
                    <ListUl>
                        <ListCheck>メールアドレスおよびパスワードが間違っている</ListCheck>
                        <ListCheck>パスワードが全角で入力されている</ListCheck>
                        <ListCheck>システムメンテナンス等の理由でログインできない時間である</ListCheck>
                        <ListCheck>規約違反等の理由でアカウントが削除されている</ListCheck>
                    </ListUl>

                    <p className="mt-4">
                        ログインできない理由がわからない場合、お問い合わせフォームにてお問い合わせください。
                    </p>
                </Accordion>
            </AccordionGrid>

            <GuideSubTitle text="マイページ、プロフィール、個人情報" />
            <AccordionGrid>
                <Accordion heading="マイページの内容">
                    <p className="mt-4 mb-2">マイページに記載の内容は以下の通りです。</p>

                    <ListUl>
                        <ListCheck>プロフィール画像</ListCheck>
                        <ListCheck>ユーザーネーム</ListCheck>
                        <ListCheck>ポイント、売上金</ListCheck>
                        <ListCheck>各種ページへのリンク</ListCheck>
                        <ListUlSecond>
                            <ListDiscSecond>プロフィール</ListDiscSecond>
                            <ListDiscSecond>プロフィール設定</ListDiscSecond>
                            <ListDiscSecond>各種個人情報設定</ListDiscSecond>
                            <ListDiscSecond>商品リスト</ListDiscSecond>
                            <ListDiscSecond>振込申請</ListDiscSecond>
                            <ListDiscSecond>購入・売上履歴</ListDiscSecond>
                            <ListDiscSecond>○○について</ListDiscSecond>
                        </ListUlSecond>
                    </ListUl>
                    <Nado />
                </Accordion>

                <Accordion heading="プロフィール情報・アカウント情報の設定">
                    <p className="mt-4 mb-2">
                        <span className="text-blue-700">会員登録後</span>
                        、マイページからプロフィール情報やアカウント情報の登録が可能になります。
                        <br />
                        プロフィール情報、アカウント情報は以下の内容を登録することができます。
                    </p>

                    <p className={clsx("mt-6", styles.PHeading)}>プロフィール情報</p>
                    <ListUl>
                        <ListCheck>プロフィール画像</ListCheck>
                        <ListCheck>ユーザーネーム</ListCheck>
                        <ListCheck>自己紹介文</ListCheck>
                    </ListUl>

                    <p className={clsx("mt-6", styles.PHeading)}>アカウント情報</p>
                    <ListUl>
                        <ListCheck>氏名（漢字・カナ）</ListCheck>
                        <ListCheck>住所</ListCheck>
                        <ListCheck>電話番号</ListCheck>
                        <ListCheck>メールアドレス変更</ListCheck>
                        <ListCheck>振込口座</ListCheck>
                    </ListUl>
                    <Nado />

                    <GuideSmall>・個人情報は本人確認時にも登録できます。</GuideSmall>
                </Accordion>

                <Accordion heading="プロフィールを変更したい">
                    <ListUl>
                        <ListFlow number={1}>
                            「<span className="text-blue-700">プロフィール設定</span>」にアクセス
                        </ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={2}>
                            新しいプロフィールの内容をそれぞれ入力し、「<span className="text-red-600">登録する</span>
                            」ボタンを押したら、変更完了です。
                        </ListFlow>
                    </ListUl>
                </Accordion>

                <Accordion heading="個人情報を変更したい">
                    <ListUl>
                        <ListFlow number={1}>
                            「<span className="text-blue-700">個人情報設定</span>
                            」にアクセスし、変更したい項目を選びます。
                        </ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={2}>
                            新しい内容をそれぞれ入力し、「<span className="text-red-600">登録する</span>
                            」ボタンを押したら、変更完了です。
                        </ListFlow>
                    </ListUl>
                </Accordion>

                <Accordion heading="口座情報の設定">
                    <p>
                        マイページまたは個人情報設定から振込口座を設定できます。
                        <br />
                        <span className="font-bold">出品を希望する方は必ず入力してください！</span>
                    </p>
                    <GuideSmall>
                        ※口座情報を登録していないと、<span className="text-red-600">売上金を受け取れない</span>
                        場合があります。
                    </GuideSmall>
                </Accordion>

                <Accordion heading="本人確認について">
                    <p className="mt-4 mb-2">本人確認では以下の情報を入力していただきます。</p>

                    <ListUl>
                        <ListCheck>氏名（漢字・カナ）</ListCheck>
                        <ListCheck>生年月日</ListCheck>
                        <ListCheck>住所</ListCheck>
                        <ListCheck>電話番号</ListCheck>
                        <ListCheck>性別</ListCheck>
                        <ListCheck>身分証登録</ListCheck>
                    </ListUl>

                    <GuideSmall className="mt-6">
                        身分証は必ず<span className="text-red-600">顔写真、名前、住所、生年月日</span>
                        が記載されているものを登録してください。
                    </GuideSmall>
                    <GuideSmall className="ml-[1rem]">例：運転免許証、マイナンバーカード、パスポートなど</GuideSmall>
                    <GuideSmall>・不定期で本人確認キャンペーンを開催することがあります！</GuideSmall>
                    <GuideSmall>・本人確認済のユーザーには緑もしくは茶色のチェックマークが付きます。</GuideSmall>
                    <FontAwesomeIcon icon={faCircleCheck} className={styles.checkIcon} />
                </Accordion>
            </AccordionGrid>
        </>
    );
};
