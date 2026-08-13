import sequelize from "../../../db.js";
import { updateReportScore } from "../../../services/items/command/update.js";
import { getItemsReportScoreCron } from "../../../services/items/query/cron.js";

// 商品信頼度 1日0.9倍
export const cronItemTrustScoreUseCase = async (): Promise<number> => {
    const items = await getItemsReportScoreCron({ minReportScore: 0 });

    if (items.length === 0) return 0;

    await sequelize.transaction(async (transaction) => {
        for (const item of items) {
            await updateReportScore({
                item,
                data: { report_score: item.report_score * 0.9 },
                transaction,
            });
        }
    });

    return items.length;
};
