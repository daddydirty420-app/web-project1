import cron from "node-cron";
import { cronDecaySortBuzzNumberUseCase } from "../usecases/items/cron/cronDecaySortBuzzNumber.js";
import { cronDecaySortNumberUseCase } from "../usecases/items/cron/cronDecaySortNumber.js";

export const startItemSortDecayCron = () => {
    // Item.sort_buzz_number減算
    cron.schedule(
        "0, 30 * * * *",
        async () => {
            try {
                await cronDecaySortBuzzNumberUseCase();

                console.log("[cron] Item.sort_buzz_numberを減算しました。");
            } catch (err) {
                console.error("[cron] Item.sort_buzz_number減算エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );

    // Item.sort_number減算
    cron.schedule(
        "0 */3 * * *",
        async () => {
            try {
                await cronDecaySortNumberUseCase();

                console.log("[cron] Item.sort_numberを減算しました。");
            } catch (err) {
                console.error("[cron] Item.sort_number減算エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
