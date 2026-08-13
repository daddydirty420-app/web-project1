import cron from "node-cron";
import { cronCommentTrustScoreUseCase } from "../usecases/comment/cron/cronCommentTrustScore.js";
import { cronItemTrustScoreUseCase } from "../usecases/items/cron/cronItemTrustScore.js";
import { cronUserTrustScoreUseCase } from "../usecases/users/cron/cronUserTrustScore.js";

export const startTrustScoreCron = () => {
    // report_trust_score 0.3 → 1.0 ユーザー信頼度
    cron.schedule(
        "0 12 * * *",
        async () => {
            try {
                const updatedCount = await cronUserTrustScoreUseCase();

                if (updatedCount === 0) {
                    console.log(" [cron] 30日経過ユーザーはいません");
                    return;
                }

                console.log(`[cron] 30日経過ユーザー${updatedCount}件の報告信頼度を1.0にしました`);
            } catch (err) {
                console.log("[cron] 30日経過user.report_trust_scoreエラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );

    // 商品信頼度 1日0.9倍
    cron.schedule(
        "0 12 * * *",
        async () => {
            try {
                const updatedCount = await cronItemTrustScoreUseCase();

                if (updatedCount === 0) {
                    console.log(" [cron] report_score減点商品はありません");
                    return;
                }

                console.log(`[cron] ${updatedCount}件の商品のreport_scoreを減点しました`);
            } catch (err) {
                console.log("[cron] 商品report_score減点エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );

    // コメント信頼度 1日0.9倍
    cron.schedule(
        "0 12 * * *",
        async () => {
            try {
                const updatedCount = await cronCommentTrustScoreUseCase();

                if (updatedCount === 0) {
                    console.log(" [cron] report_score減点コメントはありません");
                    return;
                }

                console.log(`[cron] ${updatedCount}件の商品のreport_scoreを減点しました`);
            } catch (err) {
                console.log("[cron] コメントreport_score減点エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
