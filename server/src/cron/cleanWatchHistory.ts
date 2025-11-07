import cron from "node-cron";
import { Op } from "sequelize";
import { WatchHistory } from "../models/index.js";

export const startCleanWatchHistoryCron = () => {
    cron.schedule("0 12 * * *", async () => {
        const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

        try {
            const deleted: number = await WatchHistory.destroy({
                where: {
                    updatedAt: { [Op.lt]: thirtyDaysAgo },
                },
            });

            console.log(`[cron] 30日経過WatchHistoryを削除しました: ${deleted}件`);
        } catch (err) {
            console.error('WatchHistory削除エラー：', err);
        }
    }, {
        timezone: "Asia/Tokyo"
    });
};