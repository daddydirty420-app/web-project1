import { Back, Container } from '@/components';
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { Metadata } from 'next';
import ReferenceCode from './referenceCode';
import Logout from './logout';
import styles from './mypage.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { NormalLink, NormalLinkContainer, MypageLinkHeader, ChildrenLink } from '@/components/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCampground, faStore } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

type User = {
    id: number;
    user_name: string;
    profile_image: string;
    early_seller: boolean;
    honnin_verified: boolean;
    points: number;
    uriagekin: number;
};

type Res = {
    userData: {
        user: User;
        hasShop: boolean;
    };
    itemCount: number;
    soldItemCount: number;
    unreadCount: number;
    referenceCount: number;
}

export const metadata: Metadata = {
    title: "マイページ | FLEX OUTDOOR",
    description: "FLEX OUTDOORのマイページはこちら！ご自身のアカウントに関する情報を閲覧できます。ログインユーザーのみ！",
    robots: {
        index: false,
        follow: false
    }
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) redirect("/login");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/set-cookie`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            refreshToken: session?.refreshToken,
            rememberMe: session?.rememberMe,
        }),
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/my-page/ssr`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        console.error("認証に失敗しました。", await res.text());
        redirect("/login");
    }

    const data: Res = await res.json();

    if (!data.userData || !data.userData.user) {
        console.error('ユーザーが見つかりません。');
        redirect("/login");
    }

    const profileLink = `/profile/${session?.user?.id}`;

    return (
        <>
        <Header />

        <Container header>
            <Back />
            <section className={styles.block}>
                <Link href={profileLink} className={styles.profileBlock}>
                    <Image
                    src={data.userData.user.profile_image || '/default-profile.png'}
                    alt='プロフィール画像'
                    width={50}
                    height={50}
                    priority
                    quality={75}
                    className={styles.profileImage}
                    />
                    <p className='text-base font-bold text-[var(--theme)] ml-2 flex-1'>{data.userData.user.user_name}</p>
                    {data.userData.user.honnin_verified && (
                        <FontAwesomeIcon icon={faCircleCheck} className={styles.honninIcon} />
                     )}
                    {data.userData.user.early_seller && (
                        <FontAwesomeIcon icon={faCampground} className={styles.earlyIcon} />
                    )}
                    {data.userData.hasShop && (
                        <FontAwesomeIcon icon={faStore} className={styles.shopIcon} />
                    )}
                </Link>
                <p><Link href={profileLink} className='block text-blue-600 hover:underline hover:text-blue-800 cursor-pointer w-max ml-auto text-sm'>プロフィールを見る ＞</Link></p>
            </section>

            <Link href='/upload/before' className={styles.uploadButton}>出品する</Link>

            <section className={styles.block}>
                <div className={styles.moneyDiv}>
                    <p className={styles.moneyP}>売上金</p>
                    <p className={styles.money}>￥{data.userData.user.uriagekin?.toLocaleString()}</p>
                </div>
                <div className={styles.moneyDiv}>
                    <p className={styles.moneyP}>ポイント</p>
                    <p className={styles.money}>{data.userData.user.points?.toLocaleString()}pt</p>
                </div>
            </section>

            <nav className={styles.block}>
                <MypageLinkHeader text='アカウント' />
                <NormalLinkContainer>
                    <NormalLink url={profileLink} text='プロフィール' />
                    <NormalLink url='/edit/profile' text='プロフィール設定' />
                    <NormalLink url='/edit/email' text='メールアドレス設定' />
                    {!data.userData.hasShop && (
                        <>
                        <NormalLink url='/personal-infomation' text='個人情報設定' />
                        <NormalLink url='/edit/account' text='振込口座設定' />
                        <NormalLink url='/shop-signup/1' text='FLEX Shop登録' />
                        {!data.userData.user.honnin_verified && (
                            <ChildrenLink url='/edit/honnin'>本人確認 <span className='text-[var(--alert)]'>※300ptプレゼント中</span></ChildrenLink>
                        )}
                        </>
                    )}
                    <NormalLink url='/reccomend' text='FLEXレコメンド月額プラン加入・変更' />
                    <ReferenceCode itemCount={data.itemCount} referenceCount={data.referenceCount} accessToken={accessToken} />
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
                    <MypageLinkHeader text='FLEX Shop' />
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
                    <NormalLink url='/reccomend/history' text='FLEXレコメンド支払い履歴' />
                </NormalLinkContainer>

                <MypageLinkHeader text='FLEX OUTDOORについて' />
                <NormalLinkContainer>
                    <NormalLink url='/guide' text='使い方ガイド' />
                    <NormalLink url='/terms-and-conditions' text='利用規約' />
                    <NormalLink url='/privacy-policy' text='プライバシーポリシー' />
                    <NormalLink url='/tokutei/link' text='特定商取引法に基づく表記' />
                    <NormalLink url='/company' text='会社概要' />
                    <NormalLink url='/inquiry' text='お問い合わせ' />
                    <NormalLink url='/blog/list' text='FLEX OUTDOORブログ' />
                </NormalLinkContainer>

                <Logout />
            </nav>
        </Container>

        <Footer />
        </>
    )
}