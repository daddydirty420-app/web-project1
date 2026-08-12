import cron from "node-cron";
import { purchaseSessionCronDeleteUseCase } from "../usecases/purchaseSession/cronDelete.js";

export const startBuyDeleteCron = () => {
    // 期限切れPurchaseSession削除
    cron.schedule(
        "0 12 * * *",
        async () => {
            try {
                const deletedCount = await purchaseSessionCronDeleteUseCase();

                if (deletedCount === 0) {
                    console.log("[cron] 期限切れPurchaseSessionはありません。");
                    return;
                }

                console.log(`[cron] ${deletedCount}件の期限切れPurchaseSessionを削除しました。`);
            } catch (err) {
                console.error("[cron] 期限切れPurchaseSession削除エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
