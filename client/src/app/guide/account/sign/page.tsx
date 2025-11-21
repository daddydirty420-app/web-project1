import { TitleAndBack, Container, Accordion, AccordionGrid } from '@/components';
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { ListUl, ListFlow, ListFlowArrow, ListCheck, Nado } from '@/components/list';
import { GuideSmall } from '@/components/guide';
import styles from '@/styles/guide.module.css';
import clsx from 'clsx';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "ご利用ガイド - 会員登録について | FLEX OUTDOOR",
    description: "FLEX OUTDOORの会員登録に関する基本操作等についてわかりやすく解説しています。",
    robots: {
        index: false,
        follow: false
    }
};

export default function GuideAcSign() {
    return (
        <>
        <Header />

        <Container header>
            <TitleAndBack title="会員登録について" />

            <AccordionGrid>
                <Accordion heading="会員登録について・会員の機能">
                    <p className='mt-4 mb-2'>会員登録は無料です！</p>

                    <p className={clsx('mt-6', styles.PHeading)}>会員登録のプロセス</p>
                    <ListUl>
                        <ListFlow number={1}>「会員登録」ボタンをクリック</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={2}>メールアドレス、パスワードを登録</ListFlow>
                        <ListFlowArrow />
                        <ListFlow number={3}>メールが届いたら会員登録完了です！</ListFlow>
                    </ListUl>

                    <p className='mt-6 mb-2'>会員登録すると以下の機能がご利用いただけます。</p>

                    <ListUl className="space-y-1">
                        <ListCheck>商品の購入、出品</ListCheck>
                        <ListCheck>マイページの閲覧</ListCheck>
                        <ListCheck>プロフィール設定</ListCheck>
                        <ListCheck>カートに保存</ListCheck>
                        <ListCheck>ユーザーのフォロー</ListCheck>
                        <ListCheck>動画の保存・いいね</ListCheck>
                        <ListCheck>コメント投稿</ListCheck>
                    </ListUl>
                    <Nado />

                    <GuideSmall>※会員登録の際、<Link href='/terms-and-conditions' className='hover:underline text-blue-600 hover:text-blue-800'>利用規約</Link>・<Link href='/privacy-policy' className='hover:underline text-blue-600 hover:text-blue-800'>プライバシーポリシー</Link>への同意をお願いします。</GuideSmall>
                </Accordion>

                <Accordion heading="メールアドレス・パスワードの設定">
                    <p className='mt-4 mb-2'>パスワードは<span className='text-red-500 font-semibold'>8文字以上</span>、<span className='text-blue-700'>半角英数字（英字、数字それぞれ1文字以上）</span>で設定してください。</p>
                    <GuideSmall>※1つのメールアドレスにつきアカウント2つ以上作成することはできません。</GuideSmall>
                    <GuideSmall>※必ずメールが届くメールアドレスを設定してください。</GuideSmall>
                    <GuideSmall>※セキュリティ向上のため、推測されにくいパスワードを設定してください。</GuideSmall>
                </Accordion>

                <Accordion heading="会員登録完了メールの送信">
                    <p className='mt-4 mb-2'>メールアドレス・パスワードを登録したら、会員登録完了メールを送信します。<br />会員登録完了メールから、ホーム画面もしくはプロフィール編集画面へアクセスできます。</p>
                    <GuideSmall>※メールアドレスが<span className='text-red-500'>正しく入力</span>されていないと、メールが届かない場合があります。</GuideSmall>
                </Accordion>

                <Accordion heading='会員登録ができない'>
                    <p className='mt-4 mb-2'>会員登録が完了できない場合は以下の可能性が考えられます。</p>
                
                    <ListUl>
                        <ListCheck>メールアドレスが正しく入力されていない</ListCheck>
                        <ListCheck>メールアドレスが他のアカウントと重複している</ListCheck>
                        <ListCheck>パスワードが8文字未満である</ListCheck>
                        <ListCheck>パスワードが全角で入力されている</ListCheck>
                        <ListCheck>パスワードに半角英字小文字、数字が含まれていない</ListCheck>
                    </ListUl>

                    <GuideSmall className='mt-4'>※ 一度会員登録を完了したが、後日アカウントが削除された場合、何らかの利用規約違反が確認された可能性が考えられます。<br />詳細は<a href='/terms-and-conditions' className='hover:underline text-blue-600 hover:text-blue-800'>利用規約</a>をご覧ください。また、会員登録できない及び削除された原因がわからない場合、お問い合わせフォームにてお問い合わせください。</GuideSmall>
                </Accordion>
            </AccordionGrid>
        </Container>

        <Footer />
        </>
    )
}