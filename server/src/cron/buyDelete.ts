import cron from 'node-cron';
import { Op } from 'sequelize';
import { Delivery } from '../models/index.js';
import sequelize from '../db.js';

export const startBuyDeleteCron = () => {
    const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

    // 未購入1週間放置Delivery削除
    cron.schedule(
        '0 12 * * *',
        async () => {
            try {
                const deletedCount = await Delivery.destroy({
                    where: {
                        orders_id: null,
                        createdAt: { [Op.lt]: sevenDaysAgo },
                    },
                });

                if (deletedCount === 0) {
                    console.log('[cron] 1週間放置Deliveryはありません。');
                    return;
                }

                console.log(`[cron] ${deletedCount}件の1週間放置Deliveryを削除しました。`);
            } catch (err) {
                console.error('[cron] 1週間放置Delivery削除エラー：', err);
            }
        },
        {
            timezone: 'Asia/Tokyo',
        },
    );

    // 未購入1週間放置Order削除
};
