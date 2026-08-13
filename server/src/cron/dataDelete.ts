import cron from "node-cron";
import { notificationCronDeleteUseCase } from "../usecases/notification/cronDelete.js";
import { searchCronDeleteUseCase } from "../usecases/search/cronDelete.js";
import { watchHistoryCronDeleteUseCase } from "../usecases/watchHistory/cronDelete.js";

export const DataDeleteCron = () => {
    // 90日経過WatchHistory削除
    cron.schedule(
        "0 12 * * *",
        async () => {
            try {
                const deleted = await watchHistoryCronDeleteUseCase();

                console.log(`[cron] 90日経過WatchHistoryを削除しました: ${deleted}件`);
            } catch (err) {
                console.error("[cron] WatchHistory削除エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );

    // 180日経過search削除
    cron.schedule(
        "0 12 * * *",
        async () => {
            try {
                const deleteSearchItems = await searchCronDeleteUseCase();

                console.log(`[cron] ${deleteSearchItems}件の180日経過searchデータを削除しました。`);
            } catch (err) {
                console.error("[cron] search削除エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );

    // expires_at切れnotification削除
    cron.schedule(
        "0 12 * * *",
        async () => {
            try {
                const deleteNotification = await notificationCronDeleteUseCase();

                console.log(`[cron] ${deleteNotification}件の表示期限切れnotificationデータを削除しました。`);
            } catch (err) {
                console.error("[cron] notification削除エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
