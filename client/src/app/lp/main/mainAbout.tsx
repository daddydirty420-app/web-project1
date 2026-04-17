import styles from '../lp.module.css';
import { PamphletLink } from './mainComponent/pamphletLink';
import LightPic from '@/assets/images/ahmed-zayan-6h0xlEZoYZY-unsplash.jpg';
import CameraPic from '@/assets/images/sam-mcghee-KieCLNzKoBo-unsplash.jpg';
import { MainP } from './mainComponent/mainP';
import { MainH3 } from './mainComponent/mainh3';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
    shopPage?: boolean;
};

export const MainAbout = ({ shopPage }: Props) => {
    return (
        <>
            <PamphletLink />

            <section className={styles.mainSec}>
                <MainH3>
                    <span className="text-[var(--theme)]">○○</span>とは？
                </MainH3>
                <MainP>
                    <strong>FLEXシリーズ第一弾！</strong>
                </MainP>
                {!shopPage && (
                    <MainP>
                        「<strong className="text-[var(--theme)]">○○</strong>
                        」は、キャンプ・登山用品を動画で「
                        <strong>FLEX（自慢）</strong>
                        」して紹介する全く新しいフリマです。動画で紹介するから
                        <strong>通常のネット販売より圧倒的に面白く、商品が魅力的になります。</strong>
                        また、商品の特徴や状態がより細かく伝わるため、<strong>信頼性が抜群。</strong>
                        ぜひ、自慢のギアを、動画で「<strong>FLEX（自慢）</strong>」しましょう！
                    </MainP>
                )}
                {shopPage && (
                    <>
                        <MainP>
                            <strong>キャンプ・登山用品</strong>を中心に、<strong>動画</strong>
                            で商品紹介してアウトドア用品を出品できる全く新しいフリマ/ネットショップのプラットフォームです。
                        </MainP>
                        <Link href="/lp" className="underline">
                            <span className="text-[var(--theme)]">○○</span>とは何か、詳しく知りたい方はこちら→
                        </Link>
                    </>
                )}
            </section>

            <section className={styles.mainSec}>
                <MainH3>
                    <span className="text-[var(--theme)]">○○</span>で売れる商品
                </MainH3>
                <MainP>
                    <strong>キャンプ・登山</strong>を中心に、<strong>アウトドア用品</strong>をご出品いただけます。
                </MainP>
                <dl className={styles.dl}>
                    <dt className={styles.dt}>例：キャンプ</dt>
                    <div className={styles.exampleAll}>
                        <dd className={styles.dd}>
                            テント
                            <br />
                            タープ
                            <br />
                            シュラフ
                            <br />
                            焚き火台
                        </dd>
                        <dd className={styles.dd}>
                            バーナー
                            <br />
                            ハンモック
                            <br />
                            調理器具
                            <br />
                            コンロ
                        </dd>
                        <dd className={styles.dd}>
                            ランタン
                            <br />
                            ライト
                            <br />
                            テーブル
                            <br />
                            チェア
                        </dd>
                        <dd className={styles.nado}>など</dd>
                    </div>
                    <dt className={styles.dt}>例：登山</dt>
                    <div className={styles.exampleAll}>
                        <dd className={styles.dd}>
                            テント
                            <br />
                            タープ
                            <br />
                            シュラフ
                            <br />
                            冬山ギア
                        </dd>
                        <dd className={styles.dd}>
                            トレッキングポール
                            <br />
                            ヘッドランプ
                            <br />
                            ヘルメット
                            <br />
                            クライミングギア
                        </dd>
                        <dd className={styles.nado}>など</dd>
                    </div>
                    <dt className={styles.dt}>例：ウェア・シューズ</dt>
                    <div className={styles.exampleAll}>
                        <dd className={styles.dd}>
                            マウンテンパーカー
                            <br />
                            トレッキングパンツ
                            <br />
                            レインウェア
                            <br />
                            トレランシューズ
                        </dd>
                        <dd className={styles.dd}>
                            登山靴
                            <br />
                            tシャツ
                            <br />
                            サングラス
                            <br />
                            帽子
                        </dd>
                        <dd className={styles.nado}>など</dd>
                    </div>
                </dl>
                <Image src={LightPic} alt="焚き火とランタンの画像" width={240} className={styles.image} />
            </section>

            <section className={styles.mainSec}>
                <MainH3>どんな動画がいいの？</MainH3>
                <MainP>
                    商品を動画で紹介することで、
                    <strong>「買い物が楽しくなる」「商品や出品者が魅力的になる」「信頼性が増す」</strong>
                    というメリットがあります。
                </MainP>
                <MainP>
                    これらのメリットを踏まえたうえで、商品や出品者に関して、
                    <strong>お客様に伝えたいことが伝われば、どんな動画でも構いません。</strong>
                </MainP>
                <MainP>
                    使用感を話す、実際のシーンを映す、CM風に仕上げるなど、自由な形式で投稿できます。また、数秒のショート動画から、映画のような長編動画まで、500MB以内であれば長さも自由！
                </MainP>
                <MainP>
                    <strong>「商品が魅力的」「動画が面白い</strong>
                    といった理由で、選ばれることを目指しましょう！
                </MainP>
                <small className={styles.small}>
                    ※ 掲載できない動画もございます。詳しくは利用規約をご確認ください。
                </small>
                <Image src={CameraPic} alt="動画撮影の風景" width={280} className={styles.image} />
            </section>
        </>
    );
};
