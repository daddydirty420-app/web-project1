import cron from "node-cron";
import { decayCommentSortNumberCronUseCase } from "../usecases/comment/cronSortDecay.js";

export const startCommentSortDecayCron = () => {
    // Comment.sort_number減算
    cron.schedule(
        "0 */2 * * *",
        async () => {
            try {
                await decayCommentSortNumberCronUseCase();

                console.log("[cron] Comment.sort_numberを減算しました。");
            } catch (err) {
                console.error("[cron] Comment.sort_number減算エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
