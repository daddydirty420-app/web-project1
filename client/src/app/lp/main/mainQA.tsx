import { MainH2 } from "./mainComponent/mainh2";
import { Question } from "./mainComponent/question";
import { Answer } from "./mainComponent/answer";

export const MainQA = () => {
    return (
        <>
        <MainH2>Q&A</MainH2>

        <Question>販売手数料はいくらですか？</Question>
        <Answer>○○の販売手数料は、全ての商品で<strong className="text-[var(--theme)] text-2xl">10%</strong>。取引完了時に、商品代金の<strong className="text-[var(--theme)] text-2xl">9割</strong>が入金されます。</Answer>

        <Question>販売手数料以外に手数料は発生しますか？</Question>
        <Answer>お客様の口座への振込時に<strong>200円</strong>振込手数料が発生します。</Answer>

        <Question>送料はどのように設定できますか？</Question>
        <Answer>配送料は発払いのみで、表示価格に送料や税額などすべて含んだ額を表示します。価格設定時に、送料などを計算したうえで、すべて含んだ額を設定してください。</Answer>

        <Question>画像・動画のファイル形式は何が利用できますか？</Question>
        <Answer>画像ファイルはjpeg,jpg,png,webpなどがご利用いただけます。
            <br />動画ファイルはmp4,mov,webmなどがご利用いただけます。
        </Answer>
        </>
    );
};