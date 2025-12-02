import cron from "node-cron";
import { Op } from "sequelize";
import { Search, WatchHistory } from "../models/index.js";

export const DataDeleteCron = () => {
    const now = Date.now();
        
    cron.schedule("0 12 * * *", async () => {
        const thirtyDaysAgo = new Date(now - 1000 * 60 * 60 * 24 * 30);
    
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

    // 2か月経過search削除
    cron.schedule("0 12 * * *", async () => {
        const twoMonthAgo = new Date(now - 1000 * 60 * 60 * 24 * 60);

        try {
            const deleteSearchItems = await Search.destroy({
                where: {
                    createdAt: { [Op.lt]: twoMonthAgo },
                },
            });

            console.log(`[cron] ${deleteSearchItems}件の60日経過searchデータを削除しました。`);
        } catch (err) {}
    });
};