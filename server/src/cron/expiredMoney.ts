import cron from "node-cron";
import { cronExpiredPointsUseCase } from "../usecases/pointLots/cronExpiredPoints.js";
import { cronExpiredUriagekinUseCase } from "../usecases/uriagekinLots/cronExpiredUriagekin.js";

export const StartExpiredMoneyCron = () => {
    // 180日経過ポイント回収
    cron.schedule(
        "0 12 * * *",
        async () => {
            try {
                const { expiredCount, sumPoints } = await cronExpiredPointsUseCase();

                console.log(`[cron] 180日経過ポイントを回収しました: ${expiredCount}件 ${sumPoints}円`);
            } catch (err) {
                console.error("[cron] 期限切れポイント回収エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );

    // 180日経過売上金回収
    cron.schedule(
        "0 12 * * *",
        async () => {
            try {
                const { expiredCount, failedUserIds, missingUserIds, sumGetUriagekin, sumTransUriagekin } =
                    await cronExpiredUriagekinUseCase();

                for (const userId of missingUserIds) {
                    console.error(`[cron] user_id: ${userId} が見つかりませんでした`);
                }

                for (const userId of failedUserIds) {
                    console.error(`[cron] userId: ${userId}の売上金回収処理中にエラー発生`);
                }

                console.log(
                    `[cron] 180日経過売上金を回収しました: ${expiredCount}件 振込額：${sumTransUriagekin}円 回収額：${sumGetUriagekin}円`,
                );
            } catch (err) {
                console.error("[cron] 期限切れ売上金回収エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
