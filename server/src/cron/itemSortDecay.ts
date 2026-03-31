import cron from "node-cron";
import { Op } from "sequelize";
import { Item } from "../models/index.js";

export const startItemSortDecayCron = () => {
    cron.schedule("0, 30 * * * *", async () => {
        try {
            const items = await Item.findAll({
                where: {
                    status: { [Op.in]: ["active", "hidden"] },
                    sort_buzz_number: { [Op.gt]: 0.01 },
                },
            });

            for (const item of items) {
                const newSort = item.sort_buzz_number / 2;

                await item.update({
                    sort_buzz_number: newSort,
                });
            }

            console.log("[cron] Item.sort_buzz_numberを減算しました。");
        } catch (err) {
            console.error('Item.sort_buzz_number減算エラー：', err);
        }
    },  {
        timezone: "Asia/Tokyo"
    });

    cron.schedule("0 */3 * * *", async () => {
        try {
            const items = await Item.findAll({
                where: {
                    status: { [Op.in]: ["active", "hidden"] },
                    sort_number: { [Op.gt]: 0.01 },
                },
            });

            for (const item of items) {
                const newSort = item.sort_number / 2;

                await item.update({
                    sort_number: newSort,
                });
            }

            console.log("[cron] Item.sort_numberを減算しました。");
        } catch (err) {
            console.error("Item.sort_number減算エラー：", err);
        }
    }, {
        timezone: "Asia/Tokyo"
    });
};