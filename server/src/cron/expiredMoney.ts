import cron from "node-cron";
import { col, Op, where } from "sequelize";
import { getExpiredAll } from "../services/pointLots.js";
import { createPoint180 } from "../services/pointsUriageOver.js";

export const StartExpiredMoneyCron = () => {
    // 180日経過ポイント回収
    cron.schedule(
        "0 12 * * *",
        async () => {
            const nowDate = new Date();

            try {
                const whereCondition = {
                    [Op.and]: [{ expires_at: { [Op.lt]: nowDate } }, where(col("used_points"), Op.lt, col("points"))],
                };

                const allExpiredData = await getExpiredAll({ where: whereCondition });

                let sumPoints = 0;

                for (const data of allExpiredData) {
                    const available = data.points - data.used_points;

                    await createPoint180({
                        data: {
                            points_180: available,
                        },
                    });

                    sumPoints = sumPoints + available;
                }

                console.log(`[cron] 180日経過ポイントを回収しました: ${allExpiredData.count}件 ${sumPoints}円`);
            } catch (err) {
                console.error("期限切れポイント回収エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
