import { ChildrenLink, MypageLinkHeader, NormalLink, NormalLinkContainer } from "@/components/link";
import styles from "./mypage.module.css";
import { Res, User } from "./types";
import ReferenceCode from "./referenceCode";
import Link from "next/link";

type Props = {
    user: User;
    data: Res;
    profileLink: string;
};

export default function LinkSection({ user, data, profileLink }: Props) {
    return (
        <>
            <MypageLinkHeader text='アカウント' />
            <NormalLinkContainer>
                <NormalLink url={profileLink} text='プロフィール' />
                <NormalLink url='/edit/profile' text='プロフィール設定' />
                <NormalLink url='/edit/email' text='メールアドレス設定' />
                {!data.userData.hasShop && (
                    <>
                    <NormalLink url='/personal-infomation' text='個人情報設定' />
                    <NormalLink url='/edit/account' text='振込口座設定' />
                    <NormalLink url='/shop-signup/step1' text='ショップ登録' />
                    {!user.honnin_verified && (
                        <ChildrenLink url='/edit/honnin'>本人確認 <span className='text-[var(--alert)]'>※300ptプレゼント中</span></ChildrenLink>
                    )}
                    </>
                )}
                <NormalLink url='/reccomend' text='レコメンド月額プラン加入・変更' />
                <ReferenceCode itemCount={data.itemCount} referenceCount={data.referenceCount} />
                <Link href='/notification' className={styles.linkElem}>
                    <p>お知らせ</p>
                    {data.unreadCount >= 1 && (
                        <div className={styles.unreadDiv}>
                            <svg width={18} height={18} className={styles.unreadIcon}>
                                <circle cx={9} cy={9} r={9} fill='red' />
                            </svg>
                            {data.unreadCount < 100
                            ? (<small className={styles.count}>{data.unreadCount}</small>)
                            : (<small className={styles.count}>99+</small>)
                            }
                        </div>
                    )}
                </Link>
            </NormalLinkContainer>

            <MypageLinkHeader text='商品リスト' />
            <NormalLinkContainer>
                <NormalLink url='/item-list/cart' text='カート' />
                <NormalLink url='/item-list/good' text='高評価リスト' />
                <NormalLink url='/item-list/purchased' text='購入した商品' />
                <NormalLink url='/item-list/uploaded' text='出品した商品' />
                {data.soldItemCount > 0 && (
                    <NormalLink url='/item-list/sold' text='売却済み商品' />
                )}
                <NormalLink url='/item-list/deleted' text='削除した商品' />
                <NormalLink url='/item-list/draft' text='下書き保存' />
            </NormalLinkContainer>

            {data.userData.hasShop && (
                <>
                <MypageLinkHeader text='〇〇ショップ' />
                <NormalLinkContainer>
                    <NormalLink url='/money-management' text='売上管理（売上データの確認）' />
                    <NormalLink url='/item-list/stock' text='在庫管理' />
                    <NormalLink url='/shop-info' text='ショップ情報' />
                    <NormalLink url='/shop-info/edit' text='ショップ情報編集' />
                </NormalLinkContainer>
                </>
            )}

            <MypageLinkHeader text='振込・お支払い' />
            <NormalLinkContainer>
                <NormalLink url='/edit/account/transfar' text='振込申請' />
                <NormalLink url='/transfar/history' text='振込申請履歴' />
                <NormalLink url='/transfar/points' text='ポイント変換' />
                <NormalLink url='/history/points' text='ポイント履歴' />
                <NormalLink url='/reccomend/history' text='レコメンド支払い履歴' />
            </NormalLinkContainer>

            <MypageLinkHeader text='〇〇について' />
            <NormalLinkContainer>
                <NormalLink url='/guide' text='使い方ガイド' />
                <NormalLink url='/terms-and-conditions' text='利用規約' />
                <NormalLink url='/privacy-policy' text='プライバシーポリシー' />
                <NormalLink url='/tokutei/link' text='特定商取引法に基づく表記' />
                <NormalLink url='/company' text='会社概要' />
                <NormalLink url='/inquiry' text='お問い合わせ' />
                <NormalLink url='/blog/list' text='〇〇ブログ' />
            </NormalLinkContainer>
        </>
    );
}