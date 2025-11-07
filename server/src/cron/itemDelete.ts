import cron from "node-cron";
import { Op } from "sequelize";
import { Item, Delivery, ItemDeleteLogs } from "../models/index.js";
import sequelize from "../db.js";

export const startItemDeleteCron = () => {
    cron.schedule("0 12 * * *", async () => {
        const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

        const items = await Item.findAll({
            where: {
                public: false,
                deleted: true,
                deleted_at: { [Op.lt]: thirtyDaysAgo }, 
            },
            include: [
                {
                    model: Delivery,
                    as: "ParentDelivery",
                },
            ],
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

                if (item.ParentDelivery) {
                    await item.ParentDelivery.destroy({ transaction: t });
                }

                await item.destroy({ transaction: t });
            }

            await ItemDeleteLogs.bulkCreate(newItemDeleteLogs, { transaction: t });

            await t.commit();
            console.log(`[cron] 30日経過アイテムを${items.length}件削除しました。`);
        } catch (err) {
            await t.rollback();
            console.log("itemDeleteエラー：", err);
        }
    }, {
        timezone: "Asia/Tokyo"
    });
};