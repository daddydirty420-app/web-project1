import cron from "node-cron";
import { Op } from "sequelize";
import { Notification, Search, WatchHistory } from "../models/index.js";

export const DataDeleteCron = () => {
    const now = Date.now();

    // 90日経過WatchHistory削除
    cron.schedule(
        "0 12 * * *",
        async () => {
            const ninetyDaysAgo = new Date(now - 1000 * 60 * 60 * 24 * 90);

            try {
                const deleted: number = await WatchHistory.destroy({
                    where: {
                        updatedAt: { [Op.lt]: ninetyDaysAgo },
                    },
                });

                console.log(`[cron] 90日経過WatchHistoryを削除しました: ${deleted}件`);
            } catch (err) {
                console.error("WatchHistory削除エラー：", err);
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
            const halfYearsAgo = new Date(now - 1000 * 60 * 60 * 24 * 180);

            try {
                const deleteSearchItems = await Search.destroy({
                    where: {
                        createdAt: { [Op.lt]: halfYearsAgo },
                    },
                });

                console.log(`[cron] ${deleteSearchItems}件の180日経過searchデータを削除しました。`);
            } catch (err) {
                console.error("search削除エラー：", err);
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
                const deleteNotification = await Notification.destroy({
                    where: {
                        expires_at: { [Op.lt]: now },
                    },
                });

                console.log(`[cron] ${deleteNotification}件の表示期限切れnotificationデータを削除しました。`);
            } catch (err) {
                console.error("notification削除エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
