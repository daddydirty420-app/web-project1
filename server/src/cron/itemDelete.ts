import cron from "node-cron";
import { Op } from "sequelize";
import { Item, ItemDeleteLogs } from "../models/index.js";
import sequelize from "../db.js";

export const startItemDeleteCron = () => {
    // 論理削除後30日経過item削除、ItemDeleteLogs作成
    cron.schedule("0 12 * * *", async () => {
        const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

        const items = await Item.findAll({
            where: {
                status: "deleted",
                deleted_at: { [Op.lt]: thirtyDaysAgo }, 
            },
        });

        if (!items || items.length === 0) {
            console.log("[cron] 30日削除アイテムはありません。");
            return;
        }

        const t = await sequelize.transaction();

        try {
            const newItemDeleteLogs = [];
            for (const item of items) {
                newItemDeleteLogs.push({
                    item_id: item.id,
                    delete_user_id: item.seller_id,
                    delete_by_admin: false,
                    delete_reason: "自主削除、30日経過",
                });

                await item.destroy({ transaction: t });
            }

            await ItemDeleteLogs.bulkCreate(newItemDeleteLogs, { transaction: t });

            await t.commit();
            console.log(`[cron] 30日経過アイテムを${items.length}件削除しました。`);
        } catch (err) {
            await t.rollback();
            console.log("[cron] itemDeleteエラー：", err);
        }
    }, {
        timezone: "Asia/Tokyo"
    });

    // 1週間放置item削除
    cron.schedule("0 12 * * *", async () => {
        const t = await sequelize.transaction();
        try {
            const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

            const items = await Item.findAll({
                where: {
                    status: "editing",
                    createdAt: { [Op.lt]: sevenDaysAgo },
                },
            });

            if (items.length === 0) {
                console.log("[cron] 1週間放置itemはありません。");
                return;
            }
            await items.destroy({ transaction: t });

            await t.commit();

            console.log(`[cron] ${items.length}件の1週間放置itemを削除しました。`);
        } catch (err) {
            await t.rollback();
            console.error("[cron] 1週間放置item削除エラー：", err);
        }
    });
};