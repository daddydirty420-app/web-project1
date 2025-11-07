import styles from "../lp.module.css";
import MainH2 from "./mainComponent/mainh2";
import MainP from "./mainComponent/mainP";
import CampaignH3 from "./mainComponent/campaignh3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCampground } from "@fortawesome/free-solid-svg-icons";

export default function MainCampaign() {
    return (
        <>
        <MainH2>早期出品特典</MainH2>

        <MainP>早期出品者に限り、以下の特典がもらえます！</MainP>

        <section className={styles.mainSec}>
            <CampaignH3 number={1} text="出品点数につきポイント配布" />
            <MainP>早期出品期間中に出品すると、<strong className="text-[var(--theme)]">FLEX OUTDOOR</strong>内でご利用できる<strong>ポイントをお配りします！出品点数が増えるごとに、もらえるポイントの量が多くなります！</strong></MainP>
            <MainP>お配りしているポイントは以下の通りです。</MainP>
            <div className="ml-4 mb-4">
                <p className="text-sm">1点：<strong>100pt</strong>
                <br />5点：<strong>500pt</strong>
                <br />10点：<strong className="text-[var(--theme-sub)]">1,000pt</strong>
                <br />20点：<strong className="text-[var(--theme)]">2,000pt</strong></p>
            </div>
            <small className={styles.small}>※ 早期出品期間終了後にポイントを加算いたします。</small>
        </section>

        <section className={styles.mainSec}>
            <CampaignH3 number={2} text="販売手数料割引" />
            <MainP><strong>10点以上出品された方</strong>に限り、早期出品した商品の販売手数料が、<strong>2か月間<span className="text-[var(--theme-sub)]">10%→</span><span className="text-3xl text-[var(--theme)]">8%</span></strong></MainP>
        </section>

        <section className={styles.mainSec}>
            <CampaignH3 number={3} text="早期出品者バッジ" />
            <MainP>早期出品された方に限り、<strong>テントのバッジ</strong>が貼られます。<FontAwesomeIcon icon={faCampground} className={styles.tentIcon} />これにより、購入者も早期出品された方の判別が可能になり、先駆者ならではの<strong>信頼と安心感</strong>を与えることができます！</MainP>
        </section>

        <section className={styles.mainSec}>
            <CampaignH3 number={4} text="無料でおすすめ商品" />
            <MainP>早期出品期間中に限り、有料オプションとなる予定の「<strong>FLEXレコメンド</strong>」の機能を<strong className="text-[var(--theme)]">無料</strong>でご提供いたします。</MainP>
            <MainP>「FLEXレコメンド」は、あなたの商品が<strong>おすすめ商品欄</strong>や、<strong><span className="text-[var(--theme)]">FLEX OUTDOOR</span>公式SNS・広告</strong>に掲載されるPR機能です。</MainP>
            <MainP>これにより、商品が多くの人の目に触れ、<strong>購入率が大幅に上がります！</strong></MainP>
            <MainP>早期出品終了後は有料オプションとなる予定です。（料金未定）</MainP>
        </section>

        <section className={styles.mainSec}>
            <CampaignH3 number={5} text="出品者紹介キャンペーン" />
            <MainP>早期出品期間中に紹介コードを入力したユーザーが出品すると、<strong>紹介先・紹介元ともに、<span className="text-[var(--theme)]">1,000pt</span>お配りします！</strong></MainP>
            <MainP>紹介コードは会員登録・ログイン後、マイページから発行できます！</MainP>
            <small className={styles.small}>※ 同じ紹介コードをご入力いただけるのは<strong>2名まで</strong>です。3名以上でも入力できますが、ポイントはお配りできません。
            <br />※ 紹介コードをマイページから発行できるのは、1点以上出品したユーザーのみです。
            <br />※ 紹介先のユーザーが出品するまで、ポイントは配布されません。</small>
        </section>
        </>
    );
};